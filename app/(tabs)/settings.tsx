import { Alert, Linking, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";
import { TFavoriteItem } from "@/types";
import { useNavigation } from "expo-router";
import { TabBarIcon } from "./_layout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { URLS } from "@/constants/Urls";
import { useDictionaryContext } from "@/context/DictionaryContext";

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
};

export default function SettingsPage() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { deleteHistory } = useDictionaryContext();

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

  const SettingSection = ({ title, options }: TSection, index: any) => {
    return (
      <View style={styles.sectionContainer} key={index}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {options.map((item, itemIndex) => (
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
                <TabBarIcon size={26} name={item.iconName} color={theme.tint} />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return <View style={styles.container}>{sections.map(SettingSection)}</View>;
}

const getStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    sectionContainer: {
      padding: 15,
      alignItems: "center",
      justifyContent: "flex-start",
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
      borderColor: colors.secondary,
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
    listHistoryLabel: { fontSize: 16, fontWeight: "bold" },
    itemDate: {
      fontSize: 12,
    },
  });
