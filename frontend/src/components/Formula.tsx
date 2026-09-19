const SUB = '\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089';

/** "H2SO4" → "H₂SO₄" (SVG matnlari uchun, JSX ishlatib bo'lmaydigan joylarda) */
export function toSub(text: string): string {
  return text.replace(/(?<=[A-Za-z)])\d+/g, (m) => [...m].map((d) => SUB[Number(d)]).join(''));
}

/** "H2SO4" → H₂SO₄ (raqamlar harfdan keyin kelsa pastki indeks) */
export default function Formula({ text }: { text: string }) {
  const parts = text.split(/((?<=[A-Za-z)])\d+)/);
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <sub key={i}>{p}</sub> : p))}
    </>
  );
}
