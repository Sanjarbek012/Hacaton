import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from '../topics/topic.entity';
import { AiAssistDto } from './ai.dto';
import { SIM_GOALS } from './sim-goals';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUBJECT_UZ = { physics: 'Fizika', chemistry: 'Kimyo', biology: 'Biologiya' } as const;
const LIMIT = 20; // so'rov
const WINDOW_MS = 5 * 60 * 1000; // 5 daqiqada

@Injectable()
export class AiService {
  private readonly log = new Logger(AiService.name);
  private readonly hits = new Map<number, number[]>();

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Topic) private readonly topics: Repository<Topic>,
  ) {}

  async assist(userId: number, dto: AiAssistDto) {
    this.checkRate(userId);

    const topic = await this.topics.findOne({ where: { id: dto.topicId } });
    if (!topic) throw new NotFoundException('Mavzu topilmadi');

    const goal = (topic.simKey && SIM_GOALS[topic.simKey]) || "Bu mavzu uchun tajriba hali tayyor emas.";
    const system = [
      "Sen maktab o'quvchilari uchun virtual laboratoriyaning AI yordamchisisan.",
      `Fan: ${SUBJECT_UZ[topic.subject]}. Sinf: ${topic.grade}-sinf. Mavzu: ${topic.title}.`,
      `Tajriba maqsadi: ${goal}`,
      "O'zbek tilida (lotin yozuvi) yoz. Sodda, qisqa (120–180 so'z) va shu sinf darajasiga mos bo'l.",
      "O'quvchi ko'rayotgan aniq sonlar va moddalarga tayan. Sababni tushuntir: nima uchun shunday bo'ladi.",
      "Faqat shu laboratoriya va mavzu bo'yicha javob ber. Aniq bilmasang, taxmin qilma, shuni ayt.",
      "Xavfsizlik: real hayotda xavfli tajribalarni (zaharli gaz, portlovchi aralashmalar, xavfli moddalar tayyorlash) o'rgatma. Bunday so'rov bo'lsa, virtual tajribalar bilan cheklan va ustoz nazoratini eslat.",
      "Markdown sarlavhalari va jadval ishlatma. Qadamlar kerak bo'lsa, oddiy raqamlangan ro'yxat yoz.",
    ].join('\n');

    const state = JSON.stringify(dto.state ?? {}).slice(0, 1500);
    let prompt: string;
    if (dto.mode === 'explain') {
      prompt = `Tajribaning hozirgi holati: ${state}\nNima sodir bo'layotganini fizik/kimyoviy/biologik sababi bilan tushuntir.`;
    } else if (dto.mode === 'steps') {
      prompt = "Bu tajribani boshidan oxirigacha qanday bajarish kerakligini 4–6 qadamda yoz. Oxirida qanday natija kutilishini ayt.";
    } else {
      prompt = `Tajribaning hozirgi holati: ${state}\nO'quvchi savoli: ${(dto.question ?? '').trim() || "Tushuntirib ber."}`;
    }

    const history: Msg[] = (dto.history ?? [])
      .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));
    while (history.length && history[0].role !== 'user') history.shift();

    const answer = await this.complete(system, [...history, { role: 'user', content: prompt }]);
    return { answer };
  }

  private checkRate(userId: number) {
    const now = Date.now();
    const recent = (this.hits.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= LIMIT) {
      throw new HttpException("Juda ko'p so'rov. Bir necha daqiqadan keyin urinib ko'ring.", HttpStatus.TOO_MANY_REQUESTS);
    }
    recent.push(now);
    this.hits.set(userId, recent);
  }

  /** AI_PROVIDER=groq | gemini | anthropic. Belgilanmasa: qaysi kalit yozilgan bo'lsa, shu ishlatiladi. */
  private complete(system: string, messages: Msg[]): Promise<string> {
    const has = (k: string) => !!this.config.get<string>(k);
    const provider = (
      this.config.get<string>('AI_PROVIDER') || (has('GROQ_API_KEY') ? 'groq' : has('GEMINI_API_KEY') ? 'gemini' : 'anthropic')
    ).toLowerCase();
    if (provider === 'groq') return this.completeGroq(system, messages);
    if (provider === 'gemini') return this.completeGemini(system, messages);
    return this.completeAnthropic(system, messages);
  }

  /** Groq modeli 404 bersa, avtomatik tanlangan ishlaydigan model (server ishlab turguncha eslab qolinadi) */
  private groqModel: string | null = null;

  private groqCall(key: string, model: string, system: string, messages: Msg[]) {
    const reasoning = model.startsWith('openai/gpt-oss'); // fikrlovchi modellar: token ko'proq kerak
    return fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: system }, ...messages],
        max_tokens: reasoning ? 1800 : 900,
        temperature: 0.4,
        ...(reasoning ? { reasoning_effort: 'low' } : {}),
      }),
      signal: AbortSignal.timeout(30_000),
    });
  }

  /** Groq'dagi hozirgi modellar ro'yxatidan mos keladiganini tanlaydi */
  private async pickGroqModel(key: string, failed: string): Promise<string | null> {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(15_000),
      });
      if (!r.ok) return null;
      const ids = ((await r.json()) as { data?: { id: string }[] }).data?.map((m) => m.id) ?? [];
      const prefer = [
        'llama-3.1-8b-instant',
        'openai/gpt-oss-20b',
        'openai/gpt-oss-120b',
        'meta-llama/llama-4-scout-17b-16e-instruct',
        'meta-llama/llama-4-maverick-17b-128e-instruct',
      ];
      return (
        prefer.find((id) => id !== failed && ids.includes(id)) ??
        ids.find((id) => id !== failed && /llama|gpt-oss/.test(id) && !/guard|safeguard|whisper|tts|compound/.test(id)) ??
        null
      );
    } catch {
      return null;
    }
  }

  /** Groq: OpenAI bilan mos (chat/completions) format */
  private async completeGroq(system: string, messages: Msg[]): Promise<string> {
    const key = (this.config.get<string>('GROQ_API_KEY') ?? '').trim().replace(/^["']|["']$/g, '');
    if (!key) {
      throw new ServiceUnavailableException(
        "AI sozlanmagan: backend/.env fayliga GROQ_API_KEY yozing va backendni qayta ishga tushiring",
      );
    }
    let model = this.groqModel ?? (this.config.get<string>('GROQ_MODEL') || 'llama-3.3-70b-versatile').trim();

    let res: Response;
    try {
      res = await this.groqCall(key, model, system, messages);
      if (res.status === 404) {
        const alt = await this.pickGroqModel(key, model);
        if (alt) {
          this.log.warn(`Groq modeli "${model}" topilmadi, "${alt}" ishlatiladi. Doimiy qilish uchun .env da GROQ_MODEL=${alt} deb yozing.`);
          model = alt;
          this.groqModel = alt;
          res = await this.groqCall(key, model, system, messages);
        }
      }
    } catch (e) {
      this.log.error(`Groq API ga ulanib bo'lmadi: ${e instanceof Error ? e.message : e}`);
      throw new BadGatewayException(
        "AI serveriga ulanib bo'lmadi (30 soniya kutildi). Internet yoki VPN ni tekshiring: api.groq.com ochilishi kerak.",
      );
    }

    if (!res.ok) {
      const raw = await res.text();
      this.log.error(`Groq API ${res.status}: ${raw.slice(0, 500)}`);
      let upstream = '';
      try {
        upstream = (JSON.parse(raw) as { error?: { message?: string } }).error?.message ?? '';
      } catch {
        /* JSON emas */
      }
      const reasons: Record<number, string> = {
        400: "So'rov qabul qilinmadi (model nomi yoki so'rov xato bo'lishi mumkin)",
        401: "API kaliti noto'g'ri",
        403: "So'rov rad etildi: kalit huquqi yoki hudud cheklovi",
        404: `Model topilmadi (${model}). console.groq.com/docs/models dan hozirgi modelni tanlab, backend/.env da GROQ_MODEL ga yozing`,
        429: "Tekin limit tugadi yoki juda ko'p so'rov. Birozdan keyin urinib ko'ring",
      };
      throw new BadGatewayException(
        `AI xatosi (${res.status}): ${reasons[res.status] ?? 'AI xizmati hozir band'}.${upstream ? ` ${upstream}` : ''}`,
      );
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    // ba'zi modellar <think>...</think> qoldiradi; o'quvchiga ko'rsatmaymiz
    const text = (data.choices?.[0]?.message?.content ?? '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    if (!text) throw new BadGatewayException("AI bo'sh javob qaytardi. Qayta urinib ko'ring.");
    return text;
  }

  private async completeGemini(system: string, messages: Msg[]): Promise<string> {
    const key = (this.config.get<string>('GEMINI_API_KEY') ?? '').trim().replace(/^["']|["']$/g, '');
    if (!key) {
      throw new ServiceUnavailableException(
        "AI sozlanmagan: backend/.env fayliga GEMINI_API_KEY yozing va backendni qayta ishga tushiring",
      );
    }
    const model = (this.config.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash').trim();

    // Gemini: rollar "user" / "model"; ketma-ket bir xil rollarni birlashtiramiz
    const contents: { role: string; parts: { text: string }[] }[] = [];
    for (const m of messages) {
      const role = m.role === 'assistant' ? 'model' : 'user';
      const last = contents[contents.length - 1];
      if (last && last.role === role) last.parts[0].text += `\n${m.content}`;
      else contents.push({ role, parts: [{ text: m.content }] });
    }

    let res: Response;
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents,
            generationConfig: { maxOutputTokens: 1500, temperature: 0.4 },
          }),
          signal: AbortSignal.timeout(30_000),
        },
      );
    } catch (e) {
      this.log.error(`Gemini API ga ulanib bo'lmadi: ${e instanceof Error ? e.message : e}`);
      throw new BadGatewayException(
        "AI serveriga ulanib bo'lmadi (30 soniya kutildi). Internet yoki VPN ni tekshiring.",
      );
    }

    if (!res.ok) {
      const raw = await res.text();
      this.log.error(`Gemini API ${res.status}: ${raw.slice(0, 500)}`);
      let upstream = '';
      try {
        upstream = (JSON.parse(raw) as { error?: { message?: string } }).error?.message ?? '';
      } catch {
        /* JSON emas */
      }
      const reasons: Record<number, string> = {
        400: "Kalit noto'g'ri yoki so'rov xato",
        403: "So'rov rad etildi: kalit huquqi yoki hudud cheklovi",
        404: `Model topilmadi (${model}). backend/.env da GEMINI_MODEL ni tekshiring`,
        429: "Tekin limit tugadi yoki juda ko'p so'rov. Birozdan keyin urinib ko'ring",
      };
      throw new BadGatewayException(
        `AI xatosi (${res.status}): ${reasons[res.status] ?? 'AI xizmati hozir band'}.${upstream ? ` ${upstream}` : ''}`,
      );
    }

    const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = (data.candidates?.[0]?.content?.parts ?? []).map((x) => x.text ?? '').join('\n').trim();
    if (!text) throw new BadGatewayException("AI bo'sh javob qaytardi (xavfsizlik filtri bo'lishi mumkin). Savolni o'zgartirib ko'ring.");
    return text;
  }

  private async completeAnthropic(system: string, messages: Msg[]): Promise<string> {
    const key = (this.config.get<string>('ANTHROPIC_API_KEY') ?? '').trim().replace(/^["']|["']$/g, '');
    if (!key) {
      throw new ServiceUnavailableException(
        "AI sozlanmagan: backend/.env fayliga ANTHROPIC_API_KEY yozing va backendni qayta ishga tushiring",
      );
    }
    const model = (this.config.get<string>('ANTHROPIC_MODEL', 'claude-sonnet-5') || 'claude-sonnet-5').trim();

    let res: Response;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, max_tokens: 800, system, messages }),
        signal: AbortSignal.timeout(30_000),
      });
    } catch (e) {
      this.log.error(`Anthropic API ga ulanib bo'lmadi: ${e instanceof Error ? e.message : e}`);
      throw new BadGatewayException(
        "AI serveriga ulanib bo'lmadi (30 soniya kutildi). Internet yoki VPN ni tekshiring: api.anthropic.com ochilishi kerak.",
      );
    }

    if (!res.ok) {
      const raw = await res.text();
      this.log.error(`Anthropic API ${res.status}: ${raw.slice(0, 500)}`);
      let upstream = '';
      try {
        upstream = (JSON.parse(raw) as { error?: { message?: string } }).error?.message ?? '';
      } catch {
        /* JSON emas */
      }
      const reasons: Record<number, string> = {
        400: "So'rov qabul qilinmadi",
        401: "API kaliti noto'g'ri yoki eskirgan",
        403: "So'rov rad etildi: kalit huquqi yoki hudud/VPN cheklovi",
        404: `Model topilmadi (${model}). backend/.env da ANTHROPIC_MODEL ni tekshiring`,
        429: "Limit tugagan yoki juda ko'p so'rov",
      };
      const reason = reasons[res.status] ?? 'AI xizmati hozir band';
      throw new BadGatewayException(`AI xatosi (${res.status}): ${reason}.${upstream ? ` ${upstream}` : ''}`);
    }

    const data = (await res.json()) as { content: { type: string; text?: string }[] };
    const text = data.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text ?? '')
      .join('\n')
      .trim();
    if (!text) throw new BadGatewayException("AI bo'sh javob qaytardi. Qayta urinib ko'ring.");
    return text;
  }
}
