import { useState } from "react";
import StartScreen from "./components/StartScreen";
import PlayScreen, { type GameSummary } from "./components/PlayScreen";
import ResultScreen from "./components/ResultScreen";
import FriendsModal from "./components/FriendsModal";
import StickerBookModal from "./components/StickerBookModal";
import { unlockAudio } from "./lib/sound";
import {
  loadProgress,
  saveProgress,
  type Progress,
  type Treasure,
} from "./lib/progress";

type Screen = "start" | "play" | "result";
type Modal = null | "friends" | "stickers";

const BEST_KEY = "kidsEnglishQuizBest";

function readBest(): number | null {
  try {
    const v = localStorage.getItem(BEST_KEY);
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
}

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [modal, setModal] = useState<Modal>(null);
  const [best, setBest] = useState<number | null>(readBest);
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [lastResult, setLastResult] = useState<GameSummary | null>(null);

  function handleStart() {
    unlockAudio(); // 첫 사용자 제스처 — 오디오/TTS 잠금 해제
    setScreen("play");
  }

  function handleFinish(summary: GameSummary) {
    setLastResult(summary);

    // 진행도 누적 저장(단어 도감 합치기, 보물은 결과 화면에서 추가)
    const merged: Progress = {
      ...progress,
      totalCorrect: summary.endTotalCorrect,
      stars: summary.endStars,
      words: Array.from(new Set([...progress.words, ...summary.wordsLearned])),
    };
    setProgress(merged);
    saveProgress(merged);

    // 최고 점수
    const score = Math.round((summary.correct / 10) * 100);
    if (best === null || score > best) {
      setBest(score);
      try {
        localStorage.setItem(BEST_KEY, String(score));
      } catch {
        // 무시
      }
    }

    setScreen("result");
  }

  function handleCollectTreasure(t: Treasure) {
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        treasures: Array.from(new Set([...prev.treasures, t.id])),
      };
      saveProgress(next);
      return next;
    });
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-sky-400 via-purple-400 to-pink-400">
      {screen === "start" && (
        <StartScreen
          onStart={handleStart}
          bestScore={best}
          progress={progress}
          onOpenFriends={() => setModal("friends")}
          onOpenStickers={() => setModal("stickers")}
        />
      )}
      {screen === "play" && (
        <PlayScreen progress={progress} onFinish={handleFinish} />
      )}
      {screen === "result" && lastResult && (
        <ResultScreen
          correct={lastResult.correct}
          wrong={lastResult.wrong}
          starsEarned={lastResult.starsEarned}
          bestScore={best}
          onCollectTreasure={handleCollectTreasure}
          onPlayAgain={() => setScreen("play")}
          onHome={() => setScreen("start")}
        />
      )}

      {/* 컬렉션 모달(시작 화면에서 열림) */}
      {modal === "friends" && (
        <FriendsModal
          totalCorrect={progress.totalCorrect}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "stickers" && (
        <StickerBookModal
          collectedWords={progress.words}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default App;
