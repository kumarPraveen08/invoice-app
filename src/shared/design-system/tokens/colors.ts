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

export const lightColors: ColorPalette = {
  primary: '#6A5AE0',
  onPrimary: '#FFFFFF',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  onSurface: '#212121',
  onSurfaceMuted: '#757575',
  tabBar: '#1A1A1A',
  tabInactive: '#8B93A7',
  iconSoft: '#EDE9FF',
  shadow: '#000000',
};

export const darkColors: ColorPalette = {
  primary: '#6A5AE0',
  onPrimary: '#FFFFFF',
  background: '#121212',
  surface: '#1E1E1E',
  onSurface: '#E0E0E0',
  onSurfaceMuted: '#9E9E9E',
  tabBar: '#1A1A1A',
  tabInactive: '#8B93A7',
  iconSoft: '#2A2545',
  shadow: '#000000',
};
