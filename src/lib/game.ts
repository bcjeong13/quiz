import { CATEGORIES, type QuizItem } from "../data/quizData";

export interface Question {
  categoryKey: string;
  options: QuizItem[]; // exactly 4, same category
  answer: QuizItem; // one of options
}

export const TOTAL_QUESTIONS = 10;
const OPTIONS_PER_QUESTION = 4;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build TOTAL_QUESTIONS questions. Each question uses 4 items from a single
// category; the answer is one of those 4, chosen at random.
export function buildQuestions(): Question[] {
  const questions: Question[] = [];
  let lastAnswerWord = "";

  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const options = shuffle(category.items).slice(0, OPTIONS_PER_QUESTION);

    // Avoid asking for the exact same word twice in a row.
    let answer = options[Math.floor(Math.random() * options.length)];
    if (answer.word === lastAnswerWord) {
      const alt = options.find((o) => o.word !== lastAnswerWord);
      if (alt) answer = alt;
    }
    lastAnswerWord = answer.word;

    questions.push({ categoryKey: category.key, options, answer });
  }

  return questions;
}

// 화면에 보여주는 칭찬 문구(한국어). 배우는 단어와 음성(TTS)은 영어 유지.
export const PRAISE = ["잘했어요!", "최고예요!", "멋져요!", "정답!"];

export const FINISH_MESSAGES = [
  "최고예요!",
  "정말 잘했어요!",
  "영어 천재!",
  "계속 연습해요!",
];

export function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
