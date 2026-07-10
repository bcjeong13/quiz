import { useEffect } from "react";
import Confetti from "./Confetti";
import StarBurst from "./StarBurst";

export interface Celebration {
  emoji: string;
  title: string; // 예: "LEVEL UP!", "Your Egg Hatched!"
  subtitle?: string; // 예: "🐼 Panda unlocked!"
  color?: string; // tailwind 텍스트 색 클래스
}

interface Props {
  data: Celebration;
  onDone: () => void;
}

// 부화/성장/레벨업처럼 크게 축하할 이벤트용 전체화면 오버레이.
// 글을 못 읽는 아이도 큰 이모지 + 톡 누르면 넘어가도록 설계. 3.2초 뒤 자동 진행.
export default function CelebrationOverlay({ data, onDone }: Props) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 3200);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <button
      onClick={onDone}
      aria-label="continue"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/40 px-6 backdrop-blur-sm"
    >
      <Confetti count={30} />
      <div className="relative flex flex-col items-center gap-4">
        <StarBurst />
        <div className="animate-pop text-9xl drop-shadow-lg">{data.emoji}</div>
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
      </div>
      <span className="animate-pulse-big mt-4 rounded-full bg-white px-8 py-3 text-2xl font-black text-pink-500 shadow-lg">
        👆
      </span>
    </button>
  );
}
