// 축하 이벤트(부화/성장/레벨업) 생성기 — PlayScreen과 FriendsModal이 공유.
import type { Celebration } from "../components/CelebrationOverlay";
import { playHatch, playLevelUp } from "./sound";
import { speak } from "./speech";
import type { Level, Pet } from "./progress";

export type CelebItem = { data: Celebration; sound: () => void };

export function petCeleb(pet: Pet): CelebItem {
  const hatched = pet.key === "chick";
  return {
    data: {
      emoji: pet.emoji,
      title: hatched ? "알이 부화했어요! 🎉" : "새 친구 등장! 🎉",
      subtitle: `${pet.emoji} ${pet.name}`,
      color: "text-yellow-300",
      hatch: hatched,
      petKind: pet.key,
    },
    sound: () => {
      playHatch();
      // 캐릭터가 나타나는 타이밍에 맞춰 영어로 인사
      window.setTimeout(() => speak(pet.greeting), hatched ? 1300 : 550);
    },
  };
}

export function levelCeleb(level: Level): CelebItem {
  return {
    data: {
      emoji: level.emoji,
      title: "LEVEL UP!",
      subtitle: `Lv.${level.level} · ${level.name}`,
      color: "text-lime-300",
    },
    sound: playLevelUp,
  };
}
