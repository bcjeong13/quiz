// 정답 순간 화면 중앙에서 별/폭죽이 사방으로 퍼지는 짧은 버스트 효과.
// (결과 화면의 흩날리는 Confetti와 별개로, 1초짜리 축하 연출)

const PIECES = ["⭐", "🎉", "🌟", "✨", "🎊", "💫"];
const COUNT = 14;

export default function StarBurst() {
  const pieces = Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * Math.PI * 2; // 원형으로 고르게 분산
    const radius = 150 + (i % 3) * 45; // 살짝 다른 거리로 리듬감
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius;
    const rot = (i % 2 === 0 ? 1 : -1) * 180;
    const emoji = PIECES[i % PIECES.length];
    const size = 34 + ((i * 11) % 26);

    return (
      <span
        key={i}
        className="animate-burst absolute left-1/2 top-1/2 select-none"
        style={
          {
            "--dx": `${dx}px`,
            "--dy": `${dy}px`,
            "--rot": `${rot}deg`,
            fontSize: `${size}px`,
          } as React.CSSProperties
        }
      >
        {emoji}
      </span>
    );
  });

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {pieces}
    </div>
  );
}
