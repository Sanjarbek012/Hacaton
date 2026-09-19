import { BadRequestException, Injectable } from '@nestjs/common';
import { COLORS, pairKey, Reaction, REACTIONS, REAGENTS } from './reagents';

@Injectable()
export class ChemService {
  reagents() {
    return REAGENTS;
  }

  mix(aId: string, bId: string) {
    const a = REAGENTS.find((r) => r.id === aId);
    const b = REAGENTS.find((r) => r.id === bId);
    if (!a || !b) throw new BadRequestException("Noma'lum modda");
    if (a.id === b.id) throw new BadRequestException('Ikki xil modda tanlang');

    const known = REACTIONS.get(pairKey(a.id, b.id));
    if (known) return { a, b, known: true, reaction: known };

    const hasCopper = a.id === 'cuso4' || b.id === 'cuso4';
    const indicator = a.group === 'indikator' || b.group === 'indikator';
    const none: Reaction = {
      equation: '—',
      type: indicator ? 'indikator' : 'reaksiya kuzatilmaydi',
      observation: indicator
        ? "Eritma rangsiz qoladi: muhit ishqoriy emas (kislotali yoki neytral)."
        : "Maktab darajasidagi suyultirilgan eritmalarda ko'zga ko'rinadigan o'zgarish kuzatilmaydi.",
      visual: { liquid: hasCopper ? COLORS.BLUE : COLORS.CLEAR, precipitate: null, deposit: null, gas: false, heat: false },
    };
    return { a, b, known: false, reaction: none };
  }
}
