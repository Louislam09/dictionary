import { StyleSheet } from "react-native";

import SearchingResult from "@/components/SearchingResult";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";
import WordDefinition from "@/components/WordDefinition";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useDictionaryContext } from "@/context/DictionaryContext";
import { TDictionaryData } from "@/types";

export default function SearchingPage() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [wordToSearch, setWordToSearch] = useState<TDictionaryData | null>(
    null
  );
  const { word } = useLocalSearchParams();
  const { fetchWord } = useDictionaryContext();

  useEffect(() => {
    if (!word) return;
    (async () => {
      const [data] = (await fetchWord?.(word as string)) || [];
      setWordToSearch(data as any);
    })();
  }, [word]);

  return (
    <View style={styles.container}>
      {!wordToSearch ? (
        <SearchingResult setWordToSearch={setWordToSearch} />
      ) : (
        <WordDefinition wordData={wordToSearch} />
      )}
    </View>
  );
}

const getStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 30,
      padding: 10,
      backgroundColor: colors.background,
    },
    searchContainer: {
      width: "100%",
      height: 60,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      justifyContent: "space-between",
      elevation: 5,
    },
    searchInput: {
      flex: 0.9,
      height: 50,
      zIndex: 22,
      fontSize: 22,
      color: colors.text,
      paddingHorizontal: 5,
      paddingVertical: 5,
      backgroundColor: colors.background,
      borderRadius: 15,
    },
    historyContainer: {
      flex: 1,
      width: "100%",
      marginTop: 20,
    },
    listItem: {
      flex: 1,
      minWidth: 100,
      flexDirection: "row",
      paddingHorizontal: 20,
      borderColor: colors.secondary,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginHorizontal: 5,
      borderRadius: 5,
    },
    historyItem: {
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      marginBottom: 10,
    },
    listHistoryLabel: { fontSize: 16 },
  });
