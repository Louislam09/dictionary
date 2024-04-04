import { TabBarIcon } from "@/app/(tabs)/_layout";
import Colors from "@/constants/Colors";
import { htmlTemplate } from "@/constants/HtmlTemplate";
import { useDictionaryContext } from "@/context/DictionaryContext";
import { TDictionaryData } from "@/types";
import speakWord from "@/utils/speak";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";
import { Text } from "./Themed";
import { useCustomTheme } from "@/context/ThemeContext";

const WordDefinition = ({ wordData }: { wordData: TDictionaryData }) => {
  const { theme, themeScheme } = useCustomTheme();
  const styles = getStyles(theme, themeScheme === "dark");
  const webViewRef = useRef<WebView>(null);
  const { definition, topic, isFavorite } = wordData;
  const { isFav } = useLocalSearchParams();
  const [fav, setFav] = useState(!!isFavorite || !!isFav);
  const { addOrRemoveFavorite, addWordToHistory } = useDictionaryContext();

  useEffect(() => {
    addWordToHistory?.(topic);
  }, []);

  const onMarkAsFavorite = () => {
    addOrRemoveFavorite?.(wordData as any);
    setFav(true);
  };

  const copyContentToClipboard = () => {
    if (!webViewRef?.current) return;
    webViewRef?.current.injectJavaScript(`
      function copyContentToClipboard() {
        var content = document.body.innerText; // Extract content as needed
        window.ReactNativeWebView.postMessage(content);
      }

      copyContentToClipboard();
    `);
  };

  const wordOfDayActions: any[] = useMemo(
    () => [
      {
        iconName: "volume-up",
        action: () => speakWord(wordData.topic),
      },
      {
        iconName: `heart${fav ? "" : "-o"}`,
        action: onMarkAsFavorite,
      },
      {
        iconName: "copy",
        action: copyContentToClipboard,
      },
    ],
    [fav]
  );

  return (
    <>
      <View style={styles.wordOfDayContainer}>
        <View style={styles.wordOfDayBody}>
          <Text style={styles.bodyTitle}>{topic}</Text>
          <View style={styles.decorationLine} />
        </View>
        <View style={styles.wordOfDayAction}>
          {wordOfDayActions.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.action}>
              <TabBarIcon
                iconStyle={styles.actionIcon}
                size={26}
                name={item.iconName}
                color={theme.background}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ position: "relative" }}>
        <Text style={[styles.sectionTitle]}>Definición</Text>
        <View style={styles.sectionDecorationLine} />
      </View>
      <View style={[styles.definitionContainer]}>
        <WebView
          startInLoadingState
          style={{ backgroundColor: "transparent" }}
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: htmlTemplate(definition || "", theme, 18) }}
          scrollEnabled
          onMessage={async (event) => {
            const text = `DEFINICIÓN DE ${event.nativeEvent.data}`;
            await Clipboard.setStringAsync(text);
          }}
        />
      </View>
    </>
  );
};

export default WordDefinition;

const getStyles = (colors: typeof Colors.light, isDark?: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    wordOfDayContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 15,
      paddingHorizontal: 10,
    },
    wordOfDayBody: {
      width: "100%",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginBottom: 30,
    },
    bodyTitle: {
      color: colors.text,
      fontSize: 50,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    bodyText: {
      marginTop: -15,
      color: colors.text,
      fontSize: 20,
    },
    wordOfDayAction: {
      width: "100%",
      backgroundColor: colors.tint,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingVertical: 15,
      borderRadius: 10,
    },
    actionIcon: {
      color: isDark ? colors.text : colors.background,
    },
    sectionTitle: {
      color: colors.text,
      alignSelf: "flex-start",
      marginVertical: 15,
      marginTop: 20,
      fontSize: 20,
      fontWeight: "bold",
    },
    definitionContainer: {
      height: "100%",
      flex: 1,
      backgroundColor: "transparent",
    },
    decorationLine: {
      ...StyleSheet.absoluteFillObject,
      width: "15%",
      height: 4,
      backgroundColor: colors.tint,
      top: "90%",
      left: "3%",
    },
    sectionDecorationLine: {
      ...StyleSheet.absoluteFillObject,
      width: "10%",
      height: 4,
      backgroundColor: colors.tint,
      top: "80%",
    },
  });
