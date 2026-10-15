import type { ReactNode } from 'react';

/** AI javobidagi **qalin**, *kursiv*, `kod` belgilarini oddiy elementlarga aylantiradi (HTML kiritilmaydi). */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let k = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith('**') || t.startsWith('__')) out.push(<strong key={k++}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith('`')) out.push(<code key={k++}>{t.slice(1, -1)}</code>);
    else out.push(<em key={k++}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block = { kind: 'p'; lines: string[] } | { kind: 'ol' | 'ul'; items: string[] };

function parse(src: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of src.replace(/\r/g, '').split('\n')) {
    const line = raw.trim().replace(/^#{1,6}\s+/, '');
    if (!line) {
      blocks.push({ kind: 'p', lines: [] }); // bo'sh qator: yangi abzats
      continue;
    }
    const ol = /^\d+[.)]\s+(.*)$/.exec(line);
    const ul = /^[-*•]\s+(.*)$/.exec(line);
    const prev = blocks[blocks.length - 1];
    if (ol) {
      if (prev && prev.kind === 'ol') prev.items.push(ol[1]);
      else blocks.push({ kind: 'ol', items: [ol[1]] });
    } else if (ul) {
      if (prev && prev.kind === 'ul') prev.items.push(ul[1]);
      else blocks.push({ kind: 'ul', items: [ul[1]] });
    } else if (prev && prev.kind === 'p') prev.lines.push(line);
    else blocks.push({ kind: 'p', lines: [line] });
  }
  return blocks.filter((b) => (b.kind === 'p' ? b.lines.length > 0 : true));
}

export default function RichText({ text }: { text: string }) {
  return (
    <div className="rich">
      {parse(text).map((b, i) =>
        b.kind === 'p' ? (
          <p key={i}>{inline(b.lines.join(' '))}</p>
        ) : b.kind === 'ol' ? (
          <ol key={i}>{b.items.map((t, j) => <li key={j}>{inline(t)}</li>)}</ol>
        ) : (
          <ul key={i}>{b.items.map((t, j) => <li key={j}>{inline(t)}</li>)}</ul>
        ),
      )}
    </div>
  );
}
