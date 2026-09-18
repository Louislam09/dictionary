import { BackHandler, StyleSheet, TouchableOpacity } from "react-native";

import SearchingResult from "@/components/SearchingResult";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import WordDefinition from "@/components/WordDefinition";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useDictionaryContext } from "@/context/DictionaryContext";
import { TDictionaryData } from "@/types";
import { useCustomTheme } from "@/context/ThemeContext";
import DatabaseDebug from "@/components/DatabaseDebug";
import MyIcon from "@/components/MyIcon";

export default function SearchingPage() {
  const { theme } = useCustomTheme();
  const styles = getStyles(theme);
  const [wordToSearch, setWordToSearch] = useState<TDictionaryData | null>(
    null
  );
  const { word } = useLocalSearchParams();
  const { fetchWord } = useDictionaryContext();

  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (wordToSearch && !word) {
      setWordToSearch(null);
      return true;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Diccionario",
      headerStyle: { backgroundColor: theme.tint },
      headerTintColor: "white",
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleBack}
          style={{ paddingRight: 15, paddingVertical: 5 }}
          activeOpacity={0.7}
        >
          <MyIcon size={24} name="ArrowLeft" color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, wordToSearch, word]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return handleBack();
      }
    );

    return () => subscription.remove();
  }, [wordToSearch, word, navigation]);

  useEffect(() => {
    if (!word) {
      setWordToSearch(null);
      return;
    }
    let isMounted = true;
    (async () => {
      try {
        const [data] = (await fetchWord?.(word as string)) || [];
        if (isMounted) {
          setWordToSearch((data as any) || null);
        }
      } catch (e) {
        if (isMounted) setWordToSearch(null);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [word]);

  return (
    <View style={styles.container}>
      {!wordToSearch ? (
        <SearchingResult setWordToSearch={setWordToSearch} />
      ) : (
        <WordDefinition wordData={wordToSearch} />
      )}
      {/* <DatabaseDebug /> */}
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
