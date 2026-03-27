// Designtokens der matcher dinhjemmebane.dk

export const Colors = {
  // Baggrunde
  bg:       "#0e1520",
  bgAlt:    "#131c2b",
  card:     "#192340",

  // Navy (knapper, badges, primær interaktion)
  navy:     "#0c1a33",
  navyMid:  "#1a3358",
  navyDeep: "#060f1f",
  navyBtn:  "#1e3d6e",   // knapper i dark mode
  navyBtnHover: "#254d7c",

  // Guld accent
  gold:      "#c9a84b",
  goldLight: "#e8d5a3",
  goldDim:   "rgba(201, 168, 75, 0.12)",

  // Tekst
  text:   "#e2d4a4",
  muted:  "rgba(226, 212, 164, 0.42)",
  mutedStrong: "rgba(226, 212, 164, 0.65)",

  // Kanter / dividers
  line:   "rgba(226, 212, 164, 0.10)",
  lineMid: "rgba(226, 212, 164, 0.15)",

  // Header
  headerBg: "#0a1322",

  // Status
  available:       "#4ade80",
  availableBg:     "rgba(34, 197, 94, 0.12)",
  availableBorder: "rgba(34, 197, 94, 0.35)",
  soldOut:         "#f87171",
  soldOutBg:       "rgba(239, 68, 68, 0.12)",
  soldOutBorder:   "rgba(239, 68, 68, 0.35)",
} as const;

export const Fonts = {
  display: "BebasNeue_400Regular",
  body:    "Outfit_400Regular",
  bodyMedium: "Outfit_500Medium",
  bodySemiBold: "Outfit_600SemiBold",
  bodyBold: "Outfit_700Bold",
  bodyExtraBold: "Outfit_800ExtraBold",
} as const;

export const Radius = {
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  xxl:  22,
  full: 999,
} as const;

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 28,
  xxxl: 40,
} as const;
