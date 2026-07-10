// 펫/알을 종류별 활동적인 움직임으로 렌더. 공룡은 불을 뿜고 유니콘은 반짝인다.
// font-size는 className으로 지정(자식이 상속) — 불/반짝임은 em 단위라 크기에 맞춰 커진다.

const ANIM: Record<string, string> = {
  egg: "animate-bounce-egg",
  chick: "animate-hop",
  rabbit: "animate-hop-high",
  panda: "animate-wiggle",
  dino: "animate-wiggle",
  unicorn: "animate-floaty",
};

interface Props {
  emoji: string;
  kind: string; // 'egg' | pet.key
  className?: string; // 크기 지정(text-8xl 등)
}

export default function AnimatedPet({ emoji, kind, className = "" }: Props) {
  const anim = ANIM[kind] ?? "animate-floaty";
  return (
    <span
      className={`relative inline-flex items-center justify-center leading-none ${className}`}
    >
      <span className={`inline-block ${anim}`}>{emoji}</span>

      {kind === "dino" && (
        <span
          className="animate-fire pointer-events-none absolute left-[6%] top-[14%] text-[0.55em]"
          aria-hidden
        >
          🔥
        </span>
      )}
      {kind === "unicorn" && (
        <span
          className="animate-sparkle pointer-events-none absolute -right-1 -top-1 text-[0.4em]"
          aria-hidden
        >
          ✨
        </span>
      )}
    </span>
  );
}
