/** Orqa fon: sekin ko'tariladigan pufakchalar. `multi` bo'lsa uch fan rangida, aks holda joriy fan rangida. */
const BUBBLES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 61) % 100,
  size: 14 + ((i * 7) % 34),
  dur: 20 + ((i * 5) % 16),
  delay: -((i * 3.7) % 24),
  tone: i % 3,
}));

export default function Backdrop({ multi = false }: { multi?: boolean }) {
  return (
    <div className="backdrop" aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <i
          key={i}
          className={multi ? `tone${b.tone}` : undefined}
          style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
        />
      ))}
    </div>
  );
}
