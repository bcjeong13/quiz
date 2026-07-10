// Lightweight emoji confetti for the result screen. Pure CSS falling animation.

const PIECES = ["🎉", "⭐", "🎊", "🌟", "🎈", "✨", "🏆", "💫"];

export default function Confetti({ count = 28 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const left = (i * 97.13) % 100; // deterministic spread, no Math.random needed
    const delay = (i % 10) * 0.35;
    const duration = 3 + ((i * 7) % 4);
    const emoji = PIECES[i % PIECES.length];
    const size = 24 + ((i * 13) % 28);
    return (
      <span
        key={i}
        className="animate-fall pointer-events-none absolute top-0 select-none"
        style={{
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          fontSize: `${size}px`,
        }}
      >
        {emoji}
      </span>
    );
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces}
    </div>
  );
}
