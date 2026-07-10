// 게임이 말하는 모든 영어 문장 목록 → slug(파일명) manifest 생성.
// slug 함수는 src/lib/speech.ts 와 반드시 동일해야 한다.
import { writeFileSync } from "node:fs";

const slug = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const WORDS = [
  // fruits
  "Apple", "Banana", "Orange", "Strawberry", "Grape", "Watermelon", "Peach", "Pear",
  // animals
  "Lion", "Tiger", "Elephant", "Monkey", "Rabbit", "Bear", "Dog", "Cat",
  // vehicles
  "Car", "Bus", "Train", "Airplane", "Ship", "Bicycle", "Motorcycle", "Truck",
  // colors
  "Red", "Yellow", "Green", "Blue", "Purple", "Brown", "Black",
  // numbers
  "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
];

const GREETINGS = [
  "Hi! I am a chick! Nice to meet you!",
  "Hello! I am a rabbit! Hop hop!",
  "Hi! I am a panda!",
  "Roar! I am a dino!",
  "Hello! I am a unicorn!",
];

const texts = new Set();
for (const w of WORDS) {
  texts.add(w); // 단어 단독(정답 재생)
  texts.add(`Can you find the ${w}?`); // 문제/다시듣기
}
for (const g of GREETINGS) texts.add(g);

const manifest = [...texts].map((text) => ({ slug: slug(text), text }));
writeFileSync(
  new URL("./voice-manifest.json", import.meta.url),
  JSON.stringify(manifest, null, 2),
);
console.log(`${manifest.length} clips`);
