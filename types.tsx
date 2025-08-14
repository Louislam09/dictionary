import { Theme } from "@react-navigation/native";

export enum TFont {
  SpaceMono = "SpaceMono",
  Poppins = "Poppins",
  OpenSans = "OpenSans",
}

export type TFavoriteItem = {
  id: number;
  topic: string;
  created_at: string;
};

export type TDictionaryData = {
  definition: string;
  topic: string;
  isFavorite?: boolean;
};

export type TTheme = Theme & {
  colors?: { backgroundContrast?: string };
};

export enum EThemes {
  BlackWhite= "#3366CC",   // Accent from lightBlackAndWhite
  Green= "#3F7D71",        // Accent from lightGreen
  PinkLight= "#844A68",    // Accent from lightPinkLight
  Blue= "#2F7BB5",         // Accent from lightBlue
  BlueGray= "#E76F51",     // Accent from lightBlueGray   // Softer blue-gray, good for secondary UI
  // BlackWhite = "#000",
  // Green = "#78b0a4",
  // PinkLight = "#874a69",
  // Blue = "#2a7ac6",
  // BlueGray = "#8EACBB",
  // Orange = "#9f463c",
  // Cyan = "#20acb6",
  // BlueLight = "#3b88bf",
  // Red = "#FF5252",
  // Purple = "#2032ac",
  // BlueGreen = "#239db8",
  // Pink = "#aa2c50",
  // Yellow = "#c4c733",
}
