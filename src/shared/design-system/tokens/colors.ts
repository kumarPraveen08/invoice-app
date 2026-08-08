export type ColorPalette = {
  primary: string;
  onPrimary: string;
  background: string;
  surface: string;
  onSurface: string;
  onSurfaceMuted: string;
  tabBar: string;
  tabInactive: string;
  iconSoft: string;
  shadow: string;
};

/** Material-style seed colors (primary + soft container). */
export type ThemeSeed =
  | "violet"
  | "indigo"
  | "blue"
  | "cyan"
  | "teal"
  | "green"
  | "lime"
  | "amber"
  | "orange"
  | "rose"
  | "pink"
  | "slate";

/**
 * Per-seed M3-ish roles:
 * - light: primary ~tone 40, container ~90, onPrimary usually white (dark for bright seeds)
 * - dark:  primary ~tone 80, container ~30, onPrimary ~tone 20
 */
export const THEME_SEEDS: {
  id: ThemeSeed;
  label: string;
  light: { primary: string; onPrimary: string; container: string };
  dark: { primary: string; onPrimary: string; container: string };
}[] = [
  {
    id: "violet",
    label: "Violet",
    light: {
      primary: "#5B4FC9",
      onPrimary: "#FFFFFF",
      container: "#E5DEFF",
    },
    dark: {
      primary: "#C8BFFF",
      onPrimary: "#2F2678",
      container: "#4339A0",
    },
  },
  {
    id: "indigo",
    label: "Indigo",
    light: {
      primary: "#4659A9",
      onPrimary: "#FFFFFF",
      container: "#DCE1FF",
    },
    dark: {
      primary: "#B6C4FF",
      onPrimary: "#142778",
      container: "#2D4090",
    },
  },
  {
    id: "blue",
    label: "Blue",
    light: {
      primary: "#1B6EA8",
      onPrimary: "#FFFFFF",
      container: "#D0E4FF",
    },
    dark: {
      primary: "#9CCAFF",
      onPrimary: "#003355",
      container: "#004A77",
    },
  },
  {
    id: "cyan",
    label: "Cyan",
    light: {
      primary: "#006877",
      onPrimary: "#FFFFFF",
      container: "#A2EFFF",
    },
    dark: {
      primary: "#53D7F0",
      onPrimary: "#00363F",
      container: "#004E5A",
    },
  },
  {
    id: "teal",
    label: "Teal",
    light: {
      primary: "#006A60",
      onPrimary: "#FFFFFF",
      container: "#9FF2E5",
    },
    dark: {
      primary: "#83D5C8",
      onPrimary: "#003731",
      container: "#005048",
    },
  },
  {
    id: "green",
    label: "Green",
    light: {
      primary: "#2E6B34",
      onPrimary: "#FFFFFF",
      container: "#B8F1B6",
    },
    dark: {
      primary: "#9CD49C",
      onPrimary: "#003912",
      container: "#145221",
    },
  },
  {
    id: "lime",
    label: "Lime",
    light: {
      primary: "#4C6700",
      onPrimary: "#FFFFFF",
      container: "#C8F06C",
    },
    dark: {
      primary: "#ACD352",
      onPrimary: "#263500",
      container: "#384E00",
    },
  },
  {
    id: "amber",
    label: "Amber",
    light: {
      primary: "#855300",
      onPrimary: "#FFFFFF",
      container: "#FFDDB3",
    },
    dark: {
      primary: "#FFB95A",
      onPrimary: "#462A00",
      container: "#643F00",
    },
  },
  {
    id: "orange",
    label: "Orange",
    light: {
      primary: "#B02F00",
      onPrimary: "#FFFFFF",
      container: "#FFDBCF",
    },
    dark: {
      primary: "#FFB59A",
      onPrimary: "#5F1600",
      container: "#862200",
    },
  },
  {
    id: "rose",
    label: "Rose",
    light: {
      primary: "#B0004C",
      onPrimary: "#FFFFFF",
      container: "#FFD9E2",
    },
    dark: {
      primary: "#FFB1C8",
      onPrimary: "#65002B",
      container: "#8E003D",
    },
  },
  {
    id: "pink",
    label: "Pink",
    light: {
      primary: "#A91357",
      onPrimary: "#FFFFFF",
      container: "#FFD9E2",
    },
    dark: {
      primary: "#FFB1C8",
      onPrimary: "#640032",
      container: "#8C0048",
    },
  },
  {
    id: "slate",
    label: "Slate",
    light: {
      primary: "#51606B",
      onPrimary: "#FFFFFF",
      container: "#D4E4F0",
    },
    dark: {
      primary: "#B8C8D4",
      onPrimary: "#23333D",
      container: "#3A4953",
    },
  },
];

/** M3 neutral surfaces (baseline, independent of seed). */
const lightBase = {
  // surface / surfaceContainerLowest-ish
  background: "#F7F2FA",
  surface: "#FFFBFE",
  onSurface: "#1D1B20",
  onSurfaceMuted: "#49454F",
  tabBar: "#ECE6F0",
  tabInactive: "#79747E",
  shadow: "#000000",
} as const;

const darkBase = {
  // surface / surfaceContainer
  background: "#141218",
  surface: "#211F26",
  onSurface: "#E6E0E9",
  onSurfaceMuted: "#CAC4D0",
  tabBar: "#2B2930",
  tabInactive: "#938F99",
  shadow: "#000000",
} as const;

export function createColorPalette(
  mode: "light" | "dark",
  seed: ThemeSeed = "violet",
): ColorPalette {
  const entry = THEME_SEEDS.find((item) => item.id === seed) ?? THEME_SEEDS[0];
  const roles = mode === "dark" ? entry.dark : entry.light;
  const base = mode === "dark" ? darkBase : lightBase;
  return {
    ...base,
    primary: roles.primary,
    onPrimary: roles.onPrimary,
    iconSoft: roles.container,
  };
}

/** @deprecated Prefer createColorPalette('light', seed) */
export const lightColors: ColorPalette = createColorPalette("light", "violet");
/** @deprecated Prefer createColorPalette('dark', seed) */
export const darkColors: ColorPalette = createColorPalette("dark", "violet");
