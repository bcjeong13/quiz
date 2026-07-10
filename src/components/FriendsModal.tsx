import { PETS } from "../lib/progress";

interface Props {
  totalCorrect: number;
  onClose: () => void;
}

// 펫 컬렉션 화면. 획득한 친구는 컬러+✅, 미획득은 회색 실루엣+🔒.
export default function FriendsModal({ totalCorrect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
        <h2 className="mb-5 text-center text-3xl font-black text-purple-600">
          🐾 내 친구들
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {PETS.map((pet) => {
            const unlocked = totalCorrect >= pet.threshold;
            return (
              <div
                key={pet.key}
                className={`flex flex-col items-center gap-1 rounded-2xl p-3 ${
                  unlocked ? "bg-yellow-100" : "bg-gray-100"
                }`}
              >
                <span
                  className={`text-5xl ${
                    unlocked ? "" : "opacity-30 grayscale"
                  }`}
                >
                  {pet.emoji}
                </span>
                <span
                  className={`text-sm font-black ${
                    unlocked ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {unlocked ? `✅ ${pet.name}` : "🔒"}
                </span>
              </div>
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
    </div>
  );
}
