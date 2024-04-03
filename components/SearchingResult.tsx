import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import { router } from "expo-router";
import useTheme from "@/hooks/useTheme";
import Colors from "@/constants/Colors";
import { FlashList } from "@shopify/flash-list";
import { TabBarIcon } from "@/app/(tabs)/_layout";
import useSearch from "@/hooks/useSearch";
import { useDBContext } from "@/context/DatabaseContext";
import { useEffect, useState } from "react";
import removeAccent from "@/utils/removeAccent";
import Animation from "./Animation";
import { INSERT_FAVORITE_WORD } from "@/constants/Queries";

export default function SearchingResult({ setWordToSearch }: any) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { database, executeSql } = useDBContext();
  const [query, setQuery] = useState("");
  const notFoundSource = require("../assets/lottie/search.json");
  const [searchWords, setSearchWords] = useState<any>([]);

  const {
    state: searchState,
    performSearch,
    setSearchTerm,
  } = useSearch({ db: database });

  useEffect(() => {
    setSearchWords(searchState.searchResults);
  }, [searchState.searchResults]);

  const handelSearch = async (query: string) => {
    setQuery(query?.toLowerCase());
  };

  useEffect(() => {
    if (!query) return;
    const abortController = new AbortController();

    (async () => {
      await performSearch(query, abortController);
    })();

    return () => abortController.abort();
  }, [query]);

  const onItem = (word: any) => {
    setWordToSearch(word);
  };

  const renderHistoryItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        onPress={() => onItem(item)}
        key={"-" + index}
        style={[styles.listItem, styles.historyItem]}
      >
        <Text style={[styles.listHistoryLabel]}>{item?.topic}</Text>
        <TouchableOpacity>
          <TabBarIcon size={26} name="search" color={theme.tint} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <TouchableOpacity>
          <TabBarIcon size={26} name="search" color={theme.text} />
        </TouchableOpacity>
        <TextInput
          placeholder="Buscar aqui..."
          style={styles.searchInput}
          placeholderTextColor={theme.tabIconDefault}
          onChangeText={handelSearch}
          clearButtonMode="always"
          onFocus={() => {}}
        />
        {/* <TouchableOpacity>
          <TabBarIcon size={26} name="microphone" color={theme.text} />
        </TouchableOpacity> */}
      </View>
      <View style={[styles.historyContainer]}>
        {query && !searchWords?.length ? (
          <View style={styles.noResultsContainer}>
            <Animation
              backgroundColor={theme.background}
              source={notFoundSource}
              loop={true}
            />
            <Text style={styles.noResultsText}>Buscando ...</Text>
          </View>
        ) : (
          <FlashList
            data={searchWords || []}
            renderItem={renderHistoryItem}
            estimatedItemSize={10}
            contentContainerStyle={{
              paddingRight: 15,
            }}
            ListEmptyComponent={
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No hay resultado para: {query}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </>
  );
}

const getStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    noResultsContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    noResultsText: {
      fontSize: 18,
      color: colors.text,
    },
    container: {
      flex: 1,
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
      height: "100%",
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
