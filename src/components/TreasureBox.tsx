import { useState } from "react";
import { randomTreasure, type Treasure } from "../lib/progress";
import { playTreasure } from "../lib/sound";
import StarBurst from "./StarBurst";

interface Props {
  onCollected: (t: Treasure) => void; // 부모가 도감에 저장
}

// 게임 종료 보상: 닫힌 상자를 톡 누르면 랜덤 보상이 튀어나온다.
export default function TreasureBox({ onCollected }: Props) {
  const [reward, setReward] = useState<Treasure | null>(null);

  function open() {
    if (reward) return;
    const t = randomTreasure();
    setReward(t);
    playTreasure();
    onCollected(t);
  }

  if (!reward) {
    return (
      <button
        onClick={open}
        aria-label="open treasure box"
        className="flex flex-col items-center gap-2"
      >
        <span className="animate-pulse-big text-8xl drop-shadow-lg">🎁</span>
        <span className="rounded-full bg-white/90 px-5 py-2 text-xl font-black text-amber-600 shadow">
          보물상자 열기!
        </span>
      </button>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-2">
      <StarBurst />
      <span className="animate-pop text-8xl drop-shadow-lg">{reward.emoji}</span>
      <span className="animate-pop rounded-full bg-white/90 px-5 py-2 text-xl font-black text-purple-600 shadow">
        {reward.name} 획득!
      </span>
    </div>
  );
}
