import Colors from "@/constants/Colors";
import getThemes from "@/constants/themeColors";
import { EThemes } from "@/types";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Appearance } from "react-native";
import { useStorage } from "./LocalstoreContext";

interface ThemeContextProps {
  themeScheme: "light" | "dark";
  toggleTheme: (schema?: "light" | "dark") => void;
  theme: typeof Colors.dark;
  onChangeCurrentTheme: (currentTheme: keyof typeof EThemes) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { storedData, isDataLoaded } = useStorage();
  const colorScheme = Appearance.getColorScheme();
  const [themeScheme, setTheme] = useState<"light" | "dark">(
    colorScheme === "dark" ? "dark" : "light"
  );
  const [currentTheme, setCurrentTheme] =
    useState<keyof typeof EThemes>("BlackWhite");

  const themes = getThemes();
  const { DarkTheme, LightTheme } = themes[currentTheme];
  const customTheme = {
    dark: DarkTheme,
    light: LightTheme,
  };
  const theme = customTheme[themeScheme ?? "light"].colors;

  useEffect(() => {
    if (!isDataLoaded) return;
    setCurrentTheme(storedData.currentTheme || "Blue");
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    });

    return () => {
      subscription.remove();
    };
  }, [isDataLoaded]);

  const onChangeCurrentTheme = (themeColor: keyof typeof EThemes) => {
    setCurrentTheme(themeColor);
  };

  const toggleTheme = (scheme?: typeof themeScheme) => {
    if (typeof scheme === "string") {
      setTheme(scheme);
      return;
    }
    setTheme((colorScheme) => (colorScheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{ themeScheme, toggleTheme, theme, onChangeCurrentTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
