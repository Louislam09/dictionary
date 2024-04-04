import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AdBanner from "@/components/AdBanner";
import Animation from "@/components/Animation";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useDictionaryContext } from "@/context/DictionaryContext";
import { useCustomTheme } from "@/context/ThemeContext";
import speakWord from "@/utils/speak";
import { FlashList } from "@shopify/flash-list";
import { router, useNavigation } from "expo-router";
import { TabBarIcon } from "./_layout";
import { TFavoriteItem } from "@/types";

interface IActionItem {
  iconName: any;
  action?: any;
}

export default function SearchPage() {
  const { theme, themeScheme } = useCustomTheme();
  const isDark = themeScheme === "dark";
  const styles = getStyles(theme, isDark);
  const navigation = useNavigation<any>();
  const { historyWords, dailyWord, addOrRemoveFavorite } =
    useDictionaryContext();
  const notFoundSource = require("../../assets/lottie/history.json");
  const defaultWord = {
    id: 0,
    topic: dailyWord as string,
    created_at: "",
  };

  const wordOfDayActions: IActionItem[] = [
    {
      iconName: "volume-up",
      action: () => speakWord(dailyWord || ""),
    },
    {
      iconName: "heart-o",
      action: () => addOrRemoveFavorite?.(defaultWord),
    },
    {
      iconName: "search",
      action: () => goToDefinition(dailyWord || ""),
    },
  ];

  const renderHistoryItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        key={item.id + "-" + index}
        style={[
          styles.listItem,
          styles.historyItem,
          ,
          isDark && { borderColor: theme.text },
        ]}
        onPress={() => goToDefinition(item.topic)}
      >
        <Text
          style={[styles.listHistoryLabel, isDark && { color: theme.text }]}
        >
          {item?.topic}
          {"\n"}
          <Text style={[styles.itemDate, isDark && { color: theme.text }]}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </Text>
        <TouchableOpacity>
          <TabBarIcon
            size={26}
            name={`heart${item.isFavorite ? "" : "-o"}`}
            color={isDark ? theme.text : theme.tint}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const goToDefinition = (word: string) => {
    navigation.navigate("dictionaySearch", { word: word });
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={-100}
        style={{ flex: 1 }}
        behavior={"height"}
      >
        <View style={styles.container}>
          <View style={[styles.titleContainer]}>
            <Text style={styles.title}>Diccionario</Text>
          </View>
          <View style={[styles.content]}>
            <View style={styles.searchContainer}>
              <TouchableOpacity>
                <TabBarIcon size={26} name="search" color={theme.text} />
              </TouchableOpacity>
              <TextInput
                placeholder="Buscar aqui..."
                style={styles.searchInput}
                placeholderTextColor={theme.text}
                clearButtonMode="always"
                onFocus={() => {
                  router.navigate("/dictionaySearch");
                }}
              />
              {/* <TouchableOpacity>
                <TabBarIcon size={26} name="microphone" color={theme.text} />
              </TouchableOpacity> */}
            </View>
            <AdBanner />
            <Text style={[styles.sectionTitle]}>Palabra del dia ☀️</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.wordOfDayContainer}
            >
              <View style={styles.wordOfDayBody}>
                <Text style={styles.bodyTitle}>{dailyWord}</Text>
              </View>
              <View style={styles.wordOfDayAction}>
                {wordOfDayActions.map((item, index) => (
                  <TouchableOpacity key={index} onPress={item?.action}>
                    <TabBarIcon
                      iconStyle={styles.actionIcon}
                      size={26}
                      name={item.iconName}
                      color={theme.background}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Historial 📃</Text>
            <View style={[styles.historyContainer]}>
              <FlashList
                data={historyWords}
                renderItem={renderHistoryItem}
                estimatedItemSize={10}
                key={themeScheme}
                contentContainerStyle={{
                  paddingRight: 15,
                  backgroundColor: theme.background,
                }}
                ListEmptyComponent={
                  <View style={styles.noResultsContainer}>
                    <Animation
                      backgroundColor={"transparent"}
                      source={notFoundSource}
                      loop={true}
                    />
                    <Text
                      style={[
                        styles.noResultsText,
                        { fontWeight: "bold", color: theme.background },
                      ]}
                    >
                      Sin palabras aún.
                    </Text>

                    <Text style={[styles.noResultsText]}>
                      ¡Haz clic en el buscador para empezar!
                    </Text>
                    <TabBarIcon
                      iconStyle={styles.actionIcon}
                      size={26}
                      name="history"
                      color={theme.background}
                    />
                  </View>
                }
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: typeof Colors.light, isDark?: boolean) =>
  StyleSheet.create({
    noResultsContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      gap: 10,
      backgroundColor: colors.tint,
      borderRadius: 5,
      padding: 10,
    },
    noResultsText: {
      fontSize: 18,
      color: colors.background,
      textAlign: "center",
    },
    container: {
      flex: 1,
    },
    titleContainer: {
      width: "100%",
      height: 110,
      backgroundColor: colors.tint,
      alignItems: "center",
      paddingTop: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "white",
    },
    content: {
      width: "100%",
      position: "relative",
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 30,
      paddingTop: 40,
      alignItems: "center",
      elevation: 5,
    },
    searchContainer: {
      position: "absolute",
      width: "100%",
      height: 60,
      borderRadius: 5,
      top: -35,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      justifyContent: "space-between",
      elevation: 5,
      borderColor: colors.text,
      borderWidth: 1,
      backgroundColor: colors.background,
    },
    searchInput: {
      flex: 0.9,
      height: 50,
      fontSize: 22,
      color: colors.text,
      paddingHorizontal: 5,
      paddingVertical: 5,
      backgroundColor: colors.background,
      borderRadius: 15,
    },
    actionsButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 30,
    },
    action: {
      flex: 1,
      backgroundColor: colors.tint,
      borderRadius: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingHorizontal: 20,
      paddingVertical: 2,
      borderColor: colors.secondary,
      borderWidth: 1,
      elevation: 5,
    },
    actionText: {
      color: colors.background,
      fontSize: 14,
      marginLeft: 10,
    },
    sectionTitle: {
      color: colors.text,
      alignSelf: "flex-start",
      marginVertical: 15,
      marginTop: 20,
      fontSize: 20,
      fontWeight: "bold",
    },
    wordOfDayContainer: {
      width: "100%",
      backgroundColor: colors.tint,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 5,
      marginVertical: 10,
      borderRadius: 5,
      elevation: 5,
      borderColor: colors.secondary,
      borderWidth: 1,
    },
    wordOfDayBody: {
      backgroundColor: colors.tint,
      alignItems: "center",
      justifyContent: "flex-start",
      marginBottom: 10,
    },
    bodyTitle: {
      color: isDark ? "white" : colors.background,
      fontSize: 35,
      fontWeight: isDark ? "bold" : "normal",
    },
    bodyText: {
      marginTop: -15,
      color: "#eee",
      fontSize: 20,
    },
    wordOfDayAction: {
      width: "100%",
      backgroundColor: colors.tint,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 10,
      paddingHorizontal: 20,
    },
    actionIcon: {
      color: isDark ? colors.text : colors.background,
    },
    popularWordsContainer: {
      height: 60,
    },
    listItem: {
      flex: 1,
      minWidth: 100,
      flexDirection: "row",
      paddingHorizontal: 20,
      borderColor: colors.secondary,
      borderWidth: 1,
      elevation: 7,
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginHorizontal: 5,
      borderRadius: 5,
    },
    listItemLabel: {
      fontSize: 16,
    },
    historyContainer: {
      flex: 1,
      width: "100%",
    },
    historyItem: {
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      marginBottom: 10,
      elevation: 7,
      backgroundColor: colors.background,
    },
    listHistoryLabel: { fontSize: 16, fontWeight: "bold" },
    itemDate: {
      fontSize: 10,
    },
  });
