import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES } from "../data/quizData";
import { askForWord, speak } from "../lib/speech";
import { playBonus, playCorrect, playWrong } from "../lib/sound";
import StarBurst from "./StarBurst";
import Confetti from "./Confetti";

interface Props {
  onComplete: (starsEarned: number) => void;
}

const BONUS_STARS = 5;

// 보너스 스테이지: 한 카테고리의 8개 그림이 모두 등장. 정답 시 별 5개, 틀려도 패널티 없음.
export default function BonusRound({ onComplete }: Props) {
  // 아이템이 8개인 카테고리에서 8개 전부 사용.
  const round = useMemo(() => {
    const pool = CATEGORIES.filter((c) => c.items.length >= 8);
    const cat = pool[Math.floor(Math.random() * pool.length)];
    const options = [...cat.items].sort(() => Math.random() - 0.5).slice(0, 8);
    const answer = options[Math.floor(Math.random() * options.length)];
    return { options, answer };
  }, []);

  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [shakeWord, setShakeWord] = useState<string | null>(null);
  const solvedRef = useRef(false);

  // 진입: 팡파르 + BONUS 인트로 후 문제 시작
  useEffect(() => {
    playBonus();
    const t = window.setTimeout(() => {
      setPhase("play");
      askForWord(round.answer.word);
    }, 1400);
    return () => window.clearTimeout(t);
  }, [round]);

  function pick(word: string) {
    if (phase !== "play" || solvedRef.current) return;
    if (word === round.answer.word) {
      solvedRef.current = true;
      setPhase("done");
      playCorrect();
      window.setTimeout(() => speak(round.answer.word), 300);
      window.setTimeout(() => onComplete(BONUS_STARS), 1900);
    } else {
      // 패널티 없음 — 흔들기만 하고 다시 시도
      setShakeWord(word);
      playWrong();
      window.setTimeout(() => setShakeWord(null), 450);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-amber-400 via-orange-400 to-pink-500 px-4 py-6">
      <Confetti count={22} />

      {phase === "intro" ? (
        <div className="animate-pop flex flex-col items-center gap-3">
          <span className="text-8xl">🌟</span>
          <h1 className="text-5xl font-black text-white drop-shadow sm:text-7xl">
            BONUS ROUND!
          </h1>
          <p className="text-2xl font-black text-white/90">별 5개 찬스! ⭐⭐⭐⭐⭐</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-white/30 px-5 py-1 text-lg font-black text-white backdrop-blur">
              🌟 BONUS
            </span>
            <h1
              className="text-center text-3xl font-black text-white drop-shadow sm:text-4xl"
              translate="no"
              lang="en"
            >
              Can you find the{" "}
              <span className="text-yellow-100">{round.answer.word}</span>?
            </h1>
            <button
              onClick={() => askForWord(round.answer.word)}
              className="rounded-full bg-white px-5 py-2 text-lg font-black text-orange-500 shadow"
            >
              🔊 다시 듣기
            </button>
          </div>

          <div className="grid w-full max-w-2xl grid-cols-4 gap-3 sm:gap-4">
            {round.options.map((opt) => {
              const isAnswer = phase === "done" && opt.word === round.answer.word;
              const isShaking = shakeWord === opt.word;
              return (
                <button
                  key={opt.word}
                  onClick={() => pick(opt.word)}
                  aria-label={opt.word}
                  className={[
                    "relative flex aspect-square items-center justify-center rounded-2xl bg-white shadow-lg transition-transform active:scale-95",
                    isShaking ? "animate-shake" : "",
                    isAnswer ? "ring-8 ring-green-400" : "",
                  ].join(" ")}
                >
                  <span className="text-4xl sm:text-6xl">{opt.image}</span>
                  {isAnswer && (
                    <span className="animate-pop pointer-events-none absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl">
                      ⭕
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {phase === "done" && (
            <div className="animate-pop pointer-events-none absolute inset-0 flex items-center justify-center">
              <StarBurst />
              <div className="rounded-3xl bg-white/95 px-8 py-6 text-center shadow-2xl">
                <div className="text-4xl">⭐⭐⭐⭐⭐</div>
                <div className="mt-1 text-3xl font-black text-orange-500">
                  +5 별!
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
