// Quiet Time design system tokens.
// Source of truth: https://claude.ai/artifact/P8U4QGW7TF1XYeedpvrtqy
// Single dark theme — no light mode.

export const colors = {
  ink: "#000000",
  inkRaised: "#1F1F1F",
  chalk: "#FFFFFF",
  chalkPressed: "#D9D9D9",
  mist: "#BFBFBF",
  smoke: "#8C8C8C",
  ash: "#595959",
  lavender: "#C9B8FF",
  lavenderLight: "#E2D9FF",
} as const;

// Semantic aliases. Prefer these over raw color names at call sites:
// lavender is the only accent and is reserved for links and headings.
export const aliases = {
  link: colors.lavender,
  heading: colors.lavender,
} as const;

export const strokeWidth = 3;
export const iconStroke = 2.5;

export const radius = {
  input: 14,
  pill: 999,
} as const;

export const space = {
  space2: 8,
  space4: 16,
  space5: 20,
  space6: 24,
  space8: 32,
  space10: 40,
} as const;

export const size = {
  controlInput: 52,
  controlButton: 56,
  touchMin: 44,
} as const;

// Typography is provisional (not yet designed) — uses the platform system
// font. Keep these values easy to swap out once real type is designed.
export const type = {
  screenHeading: { fontSize: 32, lineHeight: 35, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 22, fontWeight: "400" },
  button: { fontSize: 17, lineHeight: 24, fontWeight: "700" },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "600" },
  fieldMessage: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" },
} as const;
