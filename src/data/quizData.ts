// Quiz data. We follow the spec's { word, image } shape, but `image` holds a
// big emoji instead of a PNG path so the game works instantly on every device
// with zero broken images. Swap the emoji for "/images/.../x.png" later if you
// add real art — the components render whatever `image` contains.

export interface QuizItem {
  word: string;
  image: string; // emoji (or an image URL/path)
}

export interface Category {
  key: string;
  label: string; // English label
  emoji: string; // little icon for the category
  items: QuizItem[];
}

export const CATEGORIES: Category[] = [
  {
    key: "fruits",
    label: "Fruits",
    emoji: "🍎",
    items: [
      { word: "Apple", image: "🍎" },
      { word: "Banana", image: "🍌" },
      { word: "Orange", image: "🍊" },
      { word: "Strawberry", image: "🍓" },
      { word: "Grape", image: "🍇" },
      { word: "Watermelon", image: "🍉" },
      { word: "Peach", image: "🍑" },
      { word: "Pear", image: "🍐" },
    ],
  },
  {
    key: "animals",
    label: "Animals",
    emoji: "🦁",
    items: [
      { word: "Lion", image: "🦁" },
      { word: "Tiger", image: "🐯" },
      { word: "Elephant", image: "🐘" },
      { word: "Monkey", image: "🐵" },
      { word: "Rabbit", image: "🐰" },
      { word: "Bear", image: "🐻" },
      { word: "Dog", image: "🐶" },
      { word: "Cat", image: "🐱" },
    ],
  },
  {
    key: "vehicles",
    label: "Vehicles",
    emoji: "🚗",
    items: [
      { word: "Car", image: "🚗" },
      { word: "Bus", image: "🚌" },
      { word: "Train", image: "🚆" },
      { word: "Airplane", image: "✈️" },
      { word: "Ship", image: "🚢" },
      { word: "Bicycle", image: "🚲" },
      { word: "Motorcycle", image: "🏍️" },
      { word: "Truck", image: "🚚" },
    ],
  },
];
