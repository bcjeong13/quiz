import { useState } from "react";
import { PETS, type Pet } from "../lib/progress";
import { petCeleb } from "../lib/celebrations";
import AnimatedPet from "./AnimatedPet";
import CelebrationOverlay, { type Celebration } from "./CelebrationOverlay";

interface Props {
  totalCorrect: number;
  onClose: () => void;
}

// 펫 컬렉션 화면. 획득한 친구는 컬러+✅, 미획득은 회색 실루엣+🔒.
export default function FriendsModal({ totalCorrect, onClose }: Props) {
  const [replay, setReplay] = useState<Celebration | null>(null);

  // 친구를 누르면 등장 연출(병아리는 부화 🥚→✨→🐥)을 다시 재생 + 영어 인사
  function playAppearance(pet: Pet) {
    const item = petCeleb(pet);
    item.sound();
    setReplay(item.data);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
        <h2 className="mb-5 text-center text-3xl font-black text-purple-600">
          🐾 내 친구들
        </h2>

        <p className="mb-3 text-center text-sm font-bold text-gray-400">
          친구를 누르면 다시 나타나며 인사해요! 👋
        </p>
        <div className="grid grid-cols-3 gap-4">
          {PETS.map((pet) => {
            const unlocked = totalCorrect >= pet.threshold;
            return (
              <button
                key={pet.key}
                onClick={() => unlocked && playAppearance(pet)}
                disabled={!unlocked}
                aria-label={unlocked ? pet.name : "locked"}
                className={`flex flex-col items-center gap-1 rounded-2xl p-3 transition-transform ${
                  unlocked ? "bg-yellow-100 active:scale-95" : "bg-gray-100"
                }`}
              >
                {unlocked ? (
                  <AnimatedPet emoji={pet.emoji} kind={pet.key} className="text-5xl" />
                ) : (
                  <span className="text-5xl opacity-30 grayscale">{pet.emoji}</span>
                )}
                <span
                  className={`text-sm font-black ${
                    unlocked ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {unlocked ? `✅ ${pet.name}` : "🔒"}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-pink-500 py-4 text-2xl font-black text-white shadow-lg transition-transform active:scale-95"
        >
          닫기
        </button>
      </div>

      {/* 친구 등장 연출 다시 보기 */}
      {replay && (
        <CelebrationOverlay
          key={replay.title}
          data={replay}
          onDone={() => setReplay(null)}
        />
      )}
    </div>
  );
}
