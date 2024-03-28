import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function useTheme() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  return theme;
}
