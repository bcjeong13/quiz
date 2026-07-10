# Kids English Picture Quiz 🐣

A super-simple English picture-matching game for 5–7 year-olds. A child taps the
right picture to match the spoken/written word — no reading required.

**Stack:** React + TypeScript + Vite + Tailwind CSS v4 + Web Speech API (TTS).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## How it plays

- Big **START** button → 10 questions.
- Each question shows **4 pictures from one category** (never mixed).
- Prompt `Find the Apple!` + voice `"Can you find the apple?"` (en-US, slow rate 0.8).
- Correct → green ⭕, happy sound, praise (Great! / Awesome! / …), auto-advances after 1s.
- Wrong → red ❌, buzz, shake, and you keep trying until you get it (success-focused).
- End screen shows Correct / Wrong / Score % and a random cheer, with confetti.
- Best score is saved to `localStorage`.

**Scoring:** a question counts as *Correct* only if solved on the first tap; any
wrong tap makes it *Wrong* (you still must find the answer to continue). So
Correct + Wrong = 10 and `Score = correct / 10 × 100`.

## Pictures = emoji

The spec referenced `/images/fruits/apple.png` etc. To make the game playable
instantly on every device with zero broken images, pictures are **big emoji**
stored in the `image` field of `src/data/quizData.ts`. The card components render
whatever `image` contains — swap an emoji for an image URL/path later and it just
works.

## Categories

- **Fruits** — Apple, Banana, Orange, Strawberry, Grape, Watermelon, Peach, Pear
- **Animals** — Lion, Tiger, Elephant, Monkey, Rabbit, Bear, Dog, Cat
- **Vehicles** — Car, Bus, Train, Airplane, Ship, Bicycle, Motorcycle, Truck

Add categories/items in `src/data/quizData.ts`.

## Project structure

```
src/
  data/quizData.ts        Categories + items ({ word, image })
  lib/game.ts             Question builder, scoring constants
  lib/speech.ts           Web Speech API TTS (en-US, rate 0.8)
  lib/sound.ts            Web Audio effects (no audio files)
  components/
    StartScreen.tsx
    PlayScreen.tsx         Core gameplay loop
    ResultScreen.tsx
    Confetti.tsx
  App.tsx                 Screen state machine + best-score storage
```
