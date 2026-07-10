import { useEffect, useState } from "react";
import Confetti from "./Confetti";
import StarBurst from "./StarBurst";
import AnimatedPet from "./AnimatedPet";

export interface Celebration {
  emoji: string;
  title: string; // 예: "LEVEL UP!", "알이 부화했어요!"
  subtitle?: string; // 예: "🐼 Panda"
  color?: string; // tailwind 텍스트 색 클래스
  hatch?: boolean; // 알 부화 연출(🥚→✨→🐥) 여부
  petKind?: string; // 펫 종류(움직임 선택용) — 없으면 정적 이모지
}

interface Props {
  data: Celebration;
  onDone: () => void;
}

// 부화/성장/레벨업 축하 오버레이. 글 못 읽는 아이도 큰 이모지 + 톡 누르면 넘어가게.
// 부모에서 key로 이벤트마다 새로 마운트되므로 타이머는 마운트 시 1회만 건다.
export default function CelebrationOverlay({ data, onDone }: Props) {
  const [phase, setPhase] = useState<"egg" | "spark" | "show">(
    data.hatch ? "egg" : "show",
  );

  useEffect(() => {
    const timers: number[] = [];
    if (data.hatch) {
      timers.push(window.setTimeout(() => setPhase("spark"), 700));
      timers.push(window.setTimeout(() => setPhase("show"), 1150));
    }
    timers.push(window.setTimeout(onDone, data.hatch ? 4300 : 3200));
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      onClick={onDone}
      aria-label="continue"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/40 px-6 backdrop-blur-sm"
    >
      <Confetti count={30} />
      <div className="relative flex flex-col items-center gap-4">
        <StarBurst />

        {/* 캐릭터: 부화 연출이면 🥚→✨→🐥, 아니면 바로 움직이는 펫 */}
        {data.hatch && phase === "egg" && (
          <div className="animate-bounce-egg text-9xl drop-shadow-lg">🥚</div>
        )}
        {data.hatch && phase === "spark" && (
          <div className="animate-pop text-9xl drop-shadow-lg">✨</div>
        )}
        {(!data.hatch || phase === "show") &&
          (data.petKind ? (
            <AnimatedPet
              emoji={data.emoji}
              kind={data.petKind}
              className="animate-pop text-9xl drop-shadow-lg"
            />
          ) : (
            <div className="animate-pop text-9xl drop-shadow-lg">
              {data.emoji}
            </div>
          ))}

        {/* 제목/부제는 캐릭터가 나온 뒤 표시 */}
        {(!data.hatch || phase === "show") && (
          <>
            <h2
              className={`animate-pop text-5xl font-black drop-shadow sm:text-6xl ${
                data.color ?? "text-yellow-300"
              }`}
            >
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="animate-pop text-3xl font-black text-white drop-shadow sm:text-4xl">
                {data.subtitle}
              </p>
            )}
          </>
        )}
      </div>
      <span className="animate-pulse-big mt-4 rounded-full bg-white px-8 py-3 text-2xl font-black text-pink-500 shadow-lg">
        👆
      </span>
    </button>
  );
}
