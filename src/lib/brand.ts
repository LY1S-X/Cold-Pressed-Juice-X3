/**
 * Conscious Choice — brand constants.
 * Colours are sampled from the real product: the juice orange is the exact
 * base colour of the label artwork inside JUICE-3D.glb (#F4700A).
 */
export const BRAND = {
  cream: "#F5F2EA",
  beige: "#ECE8DE",
  ink: "#151515",
  forest: "#174B36",
  sage: "#73906D",
  juice: "#F4700A",
  white: "#FFFFFF",
} as const;

export type SceneTheme = {
  bg: string;
  fg: string;
  dim: string;
  line: string;
};

const theme = (bg: string, fg: string, dimA: number, lineA: number): SceneTheme => ({
  bg,
  fg,
  dim: withAlpha(fg, dimA),
  line: withAlpha(fg, lineA),
});

export function withAlpha(hex: string, a: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export const THEMES = {
  cream: theme(BRAND.cream, BRAND.ink, 0.55, 0.14),
  beige: theme(BRAND.beige, BRAND.ink, 0.55, 0.14),
  juice: theme(BRAND.juice, BRAND.white, 0.78, 0.3),
  forest: theme(BRAND.forest, BRAND.cream, 0.62, 0.2),
  emerald: theme("#005237", BRAND.cream, 0.72, 0.26),
  ink: theme(BRAND.ink, BRAND.cream, 0.55, 0.16),
} satisfies Record<string, SceneTheme>;

export const PRODUCT = {
  brand: "Conscious Choice",
  line: "Original Kick-Start",
  type: "Cold-Pressed Juice",
  volume: "300 ml",
  city: "Bangkok",
  ingredients: ["Pineapple", "Apple", "Carrot", "Ginger"] as const,
  claims: [
    "100% Plant-Based",
    "Cold-Pressed",
    "No Added Sugar",
    "No Artificial Preservatives",
  ] as const,
  ingredientNotes: {
    Pineapple: "Naturally bright and refreshing.",
    Apple: "Natural sweetness and balance.",
    Carrot: "Earthy, smooth and naturally vibrant.",
    Ginger: "A fresh, warming finish.",
  },
  motto: "Nourish your body. Honor the Earth.",
  nutrition: [
    ["Calories", "120 kcal"],
    ["Total Carbohydrate", "28 g"],
    ["Total Sugars", "22 g"],
    ["Dietary Fiber", "2 g"],
    ["Added Sugars", "0 g"],
    ["Total Fat", "0 g"],
  ] as const,
} as const;
