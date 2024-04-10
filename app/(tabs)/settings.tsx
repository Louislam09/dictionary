import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { URLS } from "@/constants/Urls";
import { useDictionaryContext } from "@/context/DictionaryContext";
import { useCustomTheme } from "@/context/ThemeContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { TabBarIcon } from "./_layout";
import { FlashList } from "@shopify/flash-list";
import { EThemes } from "@/types";
import { useCallback } from "react";
import { useStorage } from "@/context/LocalstoreContext";

type TOption = {
  label: string;
  extraText?: string;
  iconName: React.ComponentProps<
    typeof FontAwesome | typeof FontAwesome5
  >["name"];
  action: () => void;
  isFont5?: boolean;
};

type TSection = {
  title: string;
  options: TOption[];
  id?: string;
};

export default function SettingsPage() {
  const { theme, themeScheme, onChangeCurrentTheme } = useCustomTheme();
  const styles = getStyles(theme);
  const { deleteHistory } = useDictionaryContext();
  const { toggleTheme, theme: _themeScheme } = useCustomTheme();
  const { storedData, saveData, isDataLoaded } = useStorage();

  const openAppInStore = async (appPackage: string) => {
    await Linking.openURL(appPackage);
  };

  const warnBeforeDelete = () => {
    Alert.alert(
      "Borrar Historial",
      "¿Estás seguro que quieres borrar el historial de busqueda?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "destructive",
        },
        { text: "Borrar", onPress: () => deleteHistory?.() },
      ]
    );
  };

  const sendEmail = async (email: string) => {
    const emailAddress = email;
    const subject = "";
    const body = "";

    const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    await Linking.openURL(mailtoUrl);
  };

  const colorsKey = Object.keys(EThemes) as any;

  const getColosTheme = useCallback(() => {
    return Object.values(EThemes).map((color, index) => ({
      label: colorsKey[index],
      iconName: color,
      action: () => {
        const currentTheme = colorsKey[index];
        saveData({ currentTheme });
        onChangeCurrentTheme(currentTheme);
      },
      extraText: "",
    }));
  }, []);

  const sections: TSection[] = [
    {
      title: "General",
      options: [
        {
          label: "Borrar Historial",
          iconName: "trash",
          action: warnBeforeDelete,
          extraText: "Limpiar el historial de busqueda",
        },
      ],
    },
    {
      title: "Configuración",
      options: [
        {
          label: "Modo Claro / Modo Oscuro",
          iconName: `${themeScheme === "dark" ? "sun" : "moon"}-o`,
          action: () => {
            toggleTheme();
          },
          extraText: "Cambiar entre el modo claro y el modo oscuro",
        },
      ],
    },
    {
      title: "Temas",
      id: "tema",
      options: [...getColosTheme()],
    },
    {
      title: "Más Aplicaciones",
      options: [
        {
          label: "Santa Biblia RV60: Audio",
          iconName: "book",
          action: () => openAppInStore(URLS.BIBLE),
          extraText: "Descárgala y explora la Palabra de Dios.",
        },
        {
          label: "Mira Más Apps",
          iconName: "google-play",
          action: () => openAppInStore(URLS.MORE_APPS),
          isFont5: true,
          extraText: "Ver todas nuestras aplicaciones",
        },
      ],
    },
    {
      title: "About",
      options: [
        {
          label: "Contactame",
          iconName: "envelope",
          action: () => sendEmail(URLS.ME),
          extraText: "Envíanos un correo electrónico",
        },
        {
          label: "Mira Más Apps",
          iconName: "google-play",
          action: () => openAppInStore(URLS.MORE_APPS),
          isFont5: true,
          extraText: "Ver todas nuestras aplicaciones",
        },
      ],
    },
  ];

  const renderItem = ({ item, index }: { item: TOption; index: number }) => {
    return (
      <TouchableOpacity
        onPress={item.action}
        key={item + "+" + index}
        style={[styles.listItem, { backgroundColor: item.iconName }]}
      >
        <Text
          style={[styles.listItemLabel, { color: "white", fontWeight: "bold" }]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const SettingSection = ({ title, options, id }: TSection, index: any) => {
    return (
      <View style={styles.sectionContainer} key={index}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {id ? (
          <View style={[styles.popularWordsContainer]}>
            <FlashList
              data={options}
              renderItem={renderItem}
              estimatedItemSize={50}
              horizontal
              contentContainerStyle={{
                padding: 5,
                paddingTop: 1,
                paddingLeft: 1,
                backgroundColor: theme.background,
              }}
            />
          </View>
        ) : (
          options.map((item, itemIndex) => (
            <TouchableOpacity
              activeOpacity={0.9}
              key={itemIndex}
              style={[styles.listItem, styles.historyItem]}
              onPress={item.action}
            >
              <Text style={[styles.listHistoryLabel]}>
                {item?.label}
                {"\n"}
                <Text style={styles.itemDate}>{item.extraText}</Text>
              </Text>
              <TouchableOpacity>
                {item.isFont5 ? (
                  <FontAwesome5 name="google-play" size={26} color={"green"} />
                ) : (
                  <TabBarIcon
                    size={26}
                    name={item.iconName}
                    color={theme.text}
                  />
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          backgroundColor: theme.background,
        }}
      >
        {sections.map(SettingSection)}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    popularWordsContainer: {
      height: 60,
    },
    listItemLabel: {
      fontSize: 16,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colors.background,
    },
    sectionContainer: {
      padding: 15,
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colors.background,
    },
    sectionTitle: {
      color: colors.text,
      alignSelf: "flex-start",
      paddingLeft: 15,
      marginBottom: 10,
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
      maxHeight: 76,
    },
    listHistoryLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    itemDate: {
      fontSize: 12,
      color: colors.text,
    },
  });
