import {
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";
import { TabBarIcon } from "./_layout";
import { FlashList } from "@shopify/flash-list";
import { useKeyboardVisible } from "@/hooks/useKeyboard";
import { useEffect } from "react";

interface IActionItem {
  iconName: any;
}

export default function SearchPage() {
  const theme = useTheme();
  // const isKeyboard = useKeyboardVisible();
  const styles = getStyles(theme);

  const wordOfDayActions: IActionItem[] = [
    {
      iconName: "volume-up",
    },
    {
      iconName: "heart-o",
    },
    {
      iconName: "copy",
    },
  ];
  const tredWords = ["Escuela", "Lapicero", "Libro"];
  const historyWords = [
    "Aguacate",
    "Libro",
    "Vegetales",
    "Escuela",
    "Lapicero",
    "Libro",
  ];

  const renderItem = ({ item, index }: any) => {
    return (
      <View key={item + "+" + index} style={styles.listItem}>
        <Text style={[styles.listItemLabel]}>{item}</Text>
        <TouchableOpacity>
          <TabBarIcon size={20} name="search" color={theme.tint} />
        </TouchableOpacity>
      </View>
    );
  };
  const renderHistoryItem = ({ item, index }: any) => {
    return (
      <View
        key={item + "-" + index}
        style={[styles.listItem, styles.historyItem]}
      >
        <Text style={[styles.listHistoryLabel]}>{item}</Text>
        <TouchableOpacity>
          <TabBarIcon size={26} name="heart-o" color={theme.tint} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={-100}
      style={{ flex: 1 }}
      behavior={"height"}
    >
      <View style={styles.container}>
        <View style={[styles.titleContainer]}>
          <Text style={styles.title}>Dictionary</Text>
        </View>
        <View style={[styles.content]}>
          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <TabBarIcon size={26} name="search" color={theme.text} />
            </TouchableOpacity>
            <TextInput
              placeholder="Buscar aqui..."
              style={styles.searchInput}
              placeholderTextColor={theme.tabIconDefault}
              clearButtonMode="always"
            />
            <TouchableOpacity>
              <TabBarIcon size={26} name="microphone" color={theme.text} />
            </TouchableOpacity>
          </View>
          <View style={[styles.actionsButton]}>
            <TouchableOpacity style={[styles.action]}>
              <TabBarIcon size={26} name="search" color={theme.background} />
              <Text style={styles.actionText}>Online{"\n"}Dictionary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.action]}>
              <TabBarIcon size={26} name="download" color={theme.background} />
              <Text style={styles.actionText}>Offline{"\n"}Dictionary</Text>
            </TouchableOpacity>
          </View>
          {/* wordOfDayContainer */}
          <Text style={[styles.sectionTitle]}>Palabra del dia ☀️</Text>
          <View style={styles.wordOfDayContainer}>
            <View style={styles.wordOfDayBody}>
              <Text style={styles.bodyTitle}>dog</Text>
              <Text style={styles.bodyText}>perro</Text>
            </View>
            <View style={styles.wordOfDayAction}>
              {wordOfDayActions.map((action, index) => (
                <TouchableOpacity key={index}>
                  <TabBarIcon
                    iconStyle={styles.actionIcon}
                    size={26}
                    name={action.iconName}
                    color={theme.background}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>
            Palabras populares 🔥
          </Text>
          <View style={[styles.popularWordsContainer]}>
            <FlashList
              data={tredWords}
              renderItem={renderItem}
              estimatedItemSize={50}
              horizontal
              contentContainerStyle={{
                padding: 5,
                paddingTop: 1,
                paddingLeft: 1,
              }}
            />
          </View>
          <Text style={styles.sectionTitle}>Historial 📃</Text>
          <View style={[styles.historyContainer]}>
            <FlashList
              data={historyWords}
              renderItem={renderHistoryItem}
              estimatedItemSize={10}
              contentContainerStyle={{
                paddingRight: 15,
              }}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
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
      color: colors.background,
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
    },
    wordOfDayBody: {
      backgroundColor: colors.tint,
      alignItems: "center",
      justifyContent: "flex-start",
      marginBottom: 10,
    },
    bodyTitle: {
      color: colors.background,
      fontSize: 35,
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
    actionIcon: {},
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
    },
    listHistoryLabel: { fontSize: 16 },
  });
