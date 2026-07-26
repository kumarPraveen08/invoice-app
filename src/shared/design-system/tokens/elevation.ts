import type { ViewStyle } from 'react-native';

type ElevationLevel = {
  elevation: number;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
};

export const elevation = {
  sm: {
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  md: {
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  lg: {
    elevation: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
  },
} as const satisfies Record<string, ElevationLevel>;

export function applyElevation(
  level: keyof typeof elevation,
  shadowColor: string,
): ViewStyle {
  const preset = elevation[level];
  return {
    elevation: preset.elevation,
    shadowColor,
    shadowOffset: preset.shadowOffset,
    shadowOpacity: preset.shadowOpacity,
    shadowRadius: preset.shadowRadius,
  };
}
