import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildQuestions,
  PRAISE,
  randomOf,
  TOTAL_QUESTIONS,
  type Question,
} from "../lib/game";
import { askForWord, speak } from "../lib/speech";
import { playCombo, playCorrect, playWrong } from "../lib/sound";
import {
  newLevel,
  newlyUnlockedPet,
  type Level,
  type Pet,
  type Progress,
} from "../lib/progress";
import { petCeleb, levelCeleb, type CelebItem } from "../lib/celebrations";
import StarBurst from "./StarBurst";
import Confetti from "./Confetti";
import CelebrationOverlay, { type Celebration } from "./CelebrationOverlay";
import BonusRound from "./BonusRound";
import { PetBadge, StarBadge } from "./Hud";

export interface GameSummary {
  correct: number; // 첫 시도 정답(점수 %)
  wrong: number; // 오답 문제 수
  starsEarned: number; // 이번 판에 얻은 별
  endTotalCorrect: number; // 최종 누적 정답
  endStars: number; // 최종 누적 별
  wordsLearned: string[]; // 이번 판에 맞춘 단어
  maxCombo: number;
}

interface Props {
  progress: Progress;
  onFinish: (summary: GameSummary) => void;
}

function comboText(combo: number): string {
  if (combo >= 10) return "10 Combo Master!";
  return `${combo} Combo!`;
}

export default function PlayScreen({ progress, onFinish }: Props) {
  const questions = useMemo<Question[]>(() => buildQuestions(), []);

  const [index, setIndex] = useState(0);

  // 표시용 상태(HUD)
  const [displayStars, setDisplayStars] = useState(progress.stars);
  const [displayTotal, setDisplayTotal] = useState(progress.totalCorrect);

  // 문제별 UI 상태
  const [wrongPicks, setWrongPicks] = useState<Set<string>>(new Set());
  const [solvedWord, setSolvedWord] = useState<string | null>(null);
  const [shakeWord, setShakeWord] = useState<string | null>(null);
  const [praise, setPraise] = useState<string | null>(null);
  const [comboPopup, setComboPopup] = useState<number | null>(null);

  // 이벤트 오버레이
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [showBonus, setShowBonus] = useState(false);

  // 로직용 refs(누적/점수) — 스테일 클로저 방지
  const totalCorrectRef = useRef(progress.totalCorrect);
  const starsRef = useRef(progress.stars);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const wordsRef = useRef<Set<string>>(new Set());

  const hadWrongRef = useRef(false);
  const lockRef = useRef(false);
  const bonusDoneRef = useRef(false);
  const advanceTimer = useRef<number | null>(null);

  // 축하 이벤트 큐 + 이어서 실행할 동작
  const celebQueueRef = useRef<CelebItem[]>([]);
  const contRef = useRef<(() => void) | null>(null);

  const question = questions[index];

  // 문제가 바뀔 때마다 안내(문구 + 음성)
  useEffect(() => {
    askForWord(question.answer.word);
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, [question]);

  function resetQuestionUI() {
    hadWrongRef.current = false;
    lockRef.current = false;
    setWrongPicks(new Set());
    setSolvedWord(null);
    setShakeWord(null);
    setPraise(null);
    setComboPopup(null);
  }

  function startCelebrations(items: CelebItem[], cont: () => void) {
    celebQueueRef.current = items.slice(1);
    contRef.current = cont;
    items[0].sound();
    setCelebration(items[0].data);
  }

  function onCelebrationDone() {
    const next = celebQueueRef.current.shift();
    if (next) {
      next.sound();
      setCelebration(next.data);
    } else {
      setCelebration(null);
      const cont = contRef.current;
      contRef.current = null;
      cont?.();
    }
  }

  function finishGame() {
    onFinish({
      correct: correctRef.current,
      wrong: wrongRef.current,
      starsEarned: starsRef.current - progress.stars,
      endTotalCorrect: totalCorrectRef.current,
      endStars: starsRef.current,
      wordsLearned: Array.from(wordsRef.current),
      maxCombo: maxComboRef.current,
    });
  }

  function goToNextOrFinish(justIndex: number) {
    if (justIndex + 1 >= TOTAL_QUESTIONS) {
      finishGame();
      return;
    }
    resetQuestionUI();
    setIndex(justIndex + 1);
  }

  function stepAfterQuestion(justIndex: number) {
    // 5문제 완료 후 보너스 스테이지 1회
    if (justIndex === 4 && !bonusDoneRef.current) {
      bonusDoneRef.current = true;
      resetQuestionUI();
      setShowBonus(true);
      return;
    }
    goToNextOrFinish(justIndex);
  }

  function finishQuestion(justIndex: number, pet: Pet | null, lvl: Level | null) {
    const celebs: CelebItem[] = [];
    if (pet) celebs.push(petCeleb(pet));
    if (lvl) celebs.push(levelCeleb(lvl));
    if (celebs.length) {
      startCelebrations(celebs, () => stepAfterQuestion(justIndex));
    } else {
      stepAfterQuestion(justIndex);
    }
  }

  function handleBonusComplete(bonusStars: number) {
    const before = starsRef.current;
    starsRef.current = before + bonusStars;
    setDisplayStars(starsRef.current);
    const lvl = newLevel(before, starsRef.current);
    setShowBonus(false);
    const cont = () => goToNextOrFinish(4);
    if (lvl) startCelebrations([levelCeleb(lvl)], cont);
    else cont();
  }

  function handlePick(word: string) {
    if (lockRef.current || solvedWord) return;

    if (word === question.answer.word) {
      lockRef.current = true;
      const qIndex = index;
      const firstTry = !hadWrongRef.current;

      // 점수(첫 시도 기준)
      if (firstTry) correctRef.current += 1;
      else wrongRef.current += 1;

      // 콤보
      comboRef.current = firstTry ? comboRef.current + 1 : 0;
      if (comboRef.current > maxComboRef.current)
        maxComboRef.current = comboRef.current;
      const combo = comboRef.current;
      const milestone = combo === 3 || combo === 5 || combo === 10;

      // 누적 정답(알/펫) + 별
      const beforeTC = totalCorrectRef.current;
      totalCorrectRef.current = beforeTC + 1;
      const beforeStars = starsRef.current;
      starsRef.current = beforeStars + 1 + (milestone ? 2 : 0);

      setDisplayTotal(totalCorrectRef.current);
      setDisplayStars(starsRef.current);
      wordsRef.current.add(question.answer.word);

      // 정답 연출
      setSolvedWord(word);
      setPraise(randomOf(PRAISE));
      playCorrect();
      window.setTimeout(() => speak(question.answer.word), 300);

      // 콤보 연출(높을수록 화려하게)
      if (milestone) {
        setComboPopup(combo);
        playCombo(combo);
        window.setTimeout(() => setComboPopup(null), 1100);
      }

      // 큰 이벤트(부화/성장/레벨업) 판정
      const pet = newlyUnlockedPet(beforeTC, totalCorrectRef.current);
      const lvl = newLevel(beforeStars, starsRef.current);

      advanceTimer.current = window.setTimeout(() => {
        finishQuestion(qIndex, pet, lvl);
      }, 1000);
    } else {
      // 오답 — 패널티 없음, 콤보만 끊김. 다시 시도.
      hadWrongRef.current = true;
      comboRef.current = 0;
      setWrongPicks((prev) => new Set(prev).add(word));
      setShakeWord(word);
      playWrong();
      window.setTimeout(() => setShakeWord(null), 450);
    }
  }

  const progressPct = (index / TOTAL_QUESTIONS) * 100;

  return (
    <div className="flex min-h-full flex-col px-4 py-4 sm:px-6 sm:py-6">
      {/* 상단: 문제 번호 + 펫 게이지 + 별 */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-white/25 px-4 py-1 text-base font-bold text-white backdrop-blur sm:text-lg">
            문제 {index + 1} / {TOTAL_QUESTIONS}
          </span>
          <div className="flex items-center gap-2">
            <PetBadge totalCorrect={displayTotal} />
            <StarBadge stars={displayStars} />
          </div>
        </div>
        <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-yellow-300 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* 문제 */}
      <div className="mt-5 flex flex-col items-center gap-3 text-center">
        <h1
          className="text-3xl font-black text-white drop-shadow sm:text-5xl"
          translate="no"
          lang="en"
        >
          Can you find the{" "}
          <span className="text-yellow-200">{question.answer.word}</span>?
        </h1>
        <button
          onClick={() => askForWord(question.answer.word)}
          className="rounded-full bg-white px-6 py-3 text-xl font-extrabold text-purple-600 shadow-lg transition-transform active:scale-95 sm:text-2xl"
        >
          🔊 다시 듣기
        </button>
      </div>

      {/* 보기 4개 */}
      <div className="mx-auto mt-6 grid w-full max-w-3xl grow grid-cols-2 gap-4 pb-4 sm:gap-6">
        {question.options.map((opt) => {
          const isSolved = solvedWord === opt.word;
          const isWrongPick = wrongPicks.has(opt.word);
          const isShaking = shakeWord === opt.word;

          return (
            <button
              key={opt.word}
              onClick={() => handlePick(opt.word)}
              disabled={!!solvedWord || isWrongPick}
              aria-label={opt.word}
              className={[
                "relative flex aspect-square items-center justify-center rounded-[2rem] bg-white shadow-xl transition-transform",
                isShaking ? "animate-shake" : "",
                isWrongPick ? "opacity-50" : "active:scale-95",
                isSolved ? "ring-8 ring-green-400" : "",
              ].join(" ")}
            >
              <span className="text-7xl sm:text-8xl md:text-9xl">{opt.image}</span>

              {isSolved && (
                <span className="animate-pop pointer-events-none absolute inset-0 flex items-center justify-center text-[7rem] sm:text-[9rem]">
                  ⭕
                </span>
              )}
              {isWrongPick && !isSolved && (
                <span className="animate-pop pointer-events-none absolute inset-0 flex items-center justify-center text-[7rem] sm:text-[9rem]">
                  ❌
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 정답 축하: 별/폭죽 버스트 + 큰 단어 + 칭찬 */}
      {solvedWord && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <StarBurst />
          {comboPopup !== null && comboPopup >= 5 && <Confetti count={24} />}
          <div className="animate-pop flex flex-col items-center gap-2 rounded-[2rem] bg-white/95 px-10 py-8 shadow-2xl">
            <span className="text-7xl sm:text-8xl">{question.answer.image}</span>
            <span
              className="text-5xl font-black text-purple-600 sm:text-7xl"
              translate="no"
              lang="en"
            >
              {question.answer.word}
            </span>
            {praise && (
              <span className="text-3xl font-black text-green-500 sm:text-4xl">
                {praise}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 콤보 배너 */}
      {comboPopup !== null && (
        <div className="pointer-events-none fixed inset-x-0 top-24 flex justify-center">
          <div className="animate-pop rounded-full bg-orange-500 px-8 py-3 text-3xl font-black text-white shadow-2xl sm:text-4xl">
            🔥 {comboText(comboPopup)}
          </div>
        </div>
      )}

      {/* 보너스 스테이지 */}
      {showBonus && <BonusRound onComplete={handleBonusComplete} />}

      {/* 큰 이벤트(부화/성장/레벨업) */}
      {celebration && (
        <CelebrationOverlay
          key={celebration.title}
          data={celebration}
          onDone={onCelebrationDone}
        />
      )}
    </div>
  );
}
