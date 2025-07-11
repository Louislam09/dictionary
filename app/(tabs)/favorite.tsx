import { StyleSheet, TouchableOpacity } from "react-native";

import AdBanner from "@/components/AdBanner";
import Animation from "@/components/Animation";
import { Text, View } from "@/components/Themed";
import { showRandomAd } from "@/constants/ads";
import Colors from "@/constants/Colors";
import { useDictionaryContext } from "@/context/DictionaryContext";
import { useCustomTheme } from "@/context/ThemeContext";
import useInterstitialAdBanner from "@/hooks/useInterstitialAdBanner";
import { TFavoriteItem } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import { TabBarIcon } from "./_layout";

export default function FavoritePage() {
  const { theme, themeScheme } = useCustomTheme();
  const styles = getStyles(theme);
  const { favoriteWords, addOrRemoveFavorite } = useDictionaryContext();
  const notFoundSource = require("../../assets/lottie/addFavorite.json");
  const navigation = useNavigation<any>();
  const { interstitial, interstitialLoaded } = useInterstitialAdBanner();
  const isDark = themeScheme === "dark";

  const goToDefinition = (item: TFavoriteItem) => {
    const shouldDisplayAd = showRandomAd();
    if (shouldDisplayAd) interstitial.show();
    navigation.navigate("dictionaySearch", { word: item.topic, isFav: true });
  };

  const renderHistoryItem = ({
    item,
    index,
  }: {
    item: TFavoriteItem;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => goToDefinition(item)}
        key={"-" + index}
        style={[
          styles.listItem,
          styles.historyItem,
          isDark && { borderColor: theme.text },
        ]}
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
        <TouchableOpacity onPress={() => addOrRemoveFavorite?.(item.id)}>
          <TabBarIcon
            size={26}
            name="heart"
            color={isDark ? theme.text : theme.tint}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AdBanner size="ANCHORED_ADAPTIVE_BANNER" />
      <View style={[styles.historyContainer]}>
        <FlashList
          key={themeScheme}
          data={favoriteWords}
          renderItem={renderHistoryItem}
          estimatedItemSize={10}
          contentContainerStyle={{
            paddingRight: 15,
            backgroundColor: theme.background,
          }}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <Animation
                backgroundColor={theme.background}
                source={notFoundSource}
                loop={true}
              />
              <Text style={[styles.noResultsText, { fontWeight: "bold" }]}>
                Sin palabras favoritas aún.
              </Text>
              <Text style={[styles.noResultsText]}>
                ¡Haz clic en el icono del corazón para empezar!
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const getStyles = (colors: typeof Colors.light, isDark?: boolean) =>
  StyleSheet.create({
    itemDate: {
      fontSize: 10,
    },
    noResultsContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    noResultsText: {
      fontSize: 18,
      color: colors.text,
      textAlign: "center",
    },
    historyContainer: {
      flex: 1,
      width: "100%",
      marginTop: 20,
      paddingHorizontal: 10,
      backgroundColor: colors.background,
    },
    listItem: {
      flex: 1,
      minWidth: 100,
      flexDirection: "row",
      paddingHorizontal: 20,
      borderColor: colors.text,
      borderWidth: 1,
      elevation: 7,
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginHorizontal: 5,
      borderRadius: 5,
      backgroundColor: colors.background,
    },
    historyItem: {
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      marginBottom: 15,
      backgroundColor: colors.background,
      elevation: 5,
      position: "relative",
    },
    listHistoryLabel: {
      fontSize: 16,
      textTransform: "capitalize",
      fontWeight: "bold",
      color: colors.text,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
    },
  });
