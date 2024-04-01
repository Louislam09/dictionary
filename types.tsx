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
  Orange = "#9f463c",
  Cyan = "#20acb6",
  BlueLight = "#3b88bf",
  Green = "#78b0a4",
  Red = "#FF5252",
  Purple = "#2032ac",
  BlueGreen = "#239db8",
  Pink = "#aa2c50",
  PinkLight = "#874a69",
  Yellow = "#c4c733",
  Blue = "#2a7ac6",
  BlackWhite = "#000",
}
