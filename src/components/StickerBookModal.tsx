import { CATEGORIES } from "../data/quizData";

interface Props {
  collectedWords: string[];
  onClose: () => void;
}

// 스티커 도감. 맞춘 단어는 컬러 스티커로, 아직 못 맞춘 단어는 회색 실루엣으로 표시.
export default function StickerBookModal({ collectedWords, onClose }: Props) {
  const collected = new Set(collectedWords);
  const total = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-[2rem] bg-white p-6 shadow-2xl">
        <h2 className="text-center text-3xl font-black text-purple-600">
          📖 스티커 도감
        </h2>
        <p className="mb-4 text-center text-base font-bold text-gray-400">
          {collected.size} / {total}
        </p>

        <div className="grow overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="mb-4">
              <h3 className="mb-2 text-left text-lg font-black text-gray-500">
                {cat.emoji} {cat.label}
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {cat.items.map((item) => {
                  const has = collected.has(item.word);
                  return (
                    <div
                      key={item.word}
                      className={`flex flex-col items-center gap-1 rounded-2xl p-2 ${
                        has ? "bg-green-50" : "bg-gray-100"
                      }`}
                    >
                      <span
                        className={`text-4xl ${
                          has ? "" : "opacity-25 grayscale"
                        }`}
                      >
                        {item.image}
                      </span>
                      <span
                        className={`text-[11px] font-black ${
                          has ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        {has ? item.word : "?"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-pink-500 py-4 text-2xl font-black text-white shadow-lg transition-transform active:scale-95"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
