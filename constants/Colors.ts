const light = {
  dark: false,
  colors: {
    background: "#ecf2f8",
    surface: "#ecf2f8",
    primary: "#214669",
    secondary: "#76acdb",
    accent: "#2a7ac6",
  },
};

const dark = {
  dark: true,
  colors: {
    background: "#070d13",
    surface: "#070d13",
    primary: "#97bcde",
    secondary: "#245887",
    accent: "#3a8bd5",
  },
};

// const light = {
//   dark: false,
//   colors: {
//     background: "#ebefee",
//     surface: "#ebefee",
//     primary: "#374e49",
//     secondary: "#92b9b2",
//     accent: "#4f877b",
//   },
// };

// const dark = {
//   dark: true,
//   colors: {
//     background: "#101413",
//     surface: "#101413",
//     primary: "#b1c8c3",
//     secondary: "#466d65",
//     accent: "#78b0a4",
//   },
// };

export default {
  light: {
    text: light.colors.primary,
    background: light.colors.background,
    tint: light.colors.accent,
    secondary: light.colors.secondary,
    tabIconDefault: light.colors.secondary,
    tabIconSelected: light.colors.accent,
  },
  dark: {
    text: dark.colors.primary,
    background: dark.colors.background,
    tint: dark.colors.accent,
    secondary: dark.colors.secondary,
    tabIconDefault: dark.colors.secondary,
    tabIconSelected: dark.colors.accent,
  },
};
