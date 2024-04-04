import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Text } from "@/components/Themed";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useCustomTheme } from "@/context/ThemeContext";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ITab {
  name: string;
  iconName: React.ComponentProps<typeof FontAwesome>["name"];
  fileName: string;
  options?: any;
}

export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number;
  iconStyle?: any;
}) {
  return (
    <FontAwesome size={props.size || 28} style={[props.iconStyle]} {...props} />
  );
}

const TabButton = (props: { [key: string]: any } & { item: ITab }) => {
  const {
    accessibilityState: { selected },
    onPress,
    item,
    theme,
  } = props;
  const styles = getStyles(theme);
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value }],
  }));

  useEffect(() => {
    if (selected) {
      offset.value = withTiming(20, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      offset.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [selected]);

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.tabButtonContainer,
          {
            backgroundColor: selected ? theme.background : theme.tint,
          },
        ]}
      >
        <TabBarIcon
          iconStyle={{ marginBottom: -3 }}
          name={item.iconName}
          color={selected ? theme.tint : "white"}
        />
        <Text style={{ color: selected ? theme.text : "white" }}>
          {item.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useCustomTheme();

  const tabs: ITab[] = [
    {
      name: "Buscar",
      iconName: "search",
      fileName: "index",
    },
    {
      name: "Favoritos",
      iconName: "heart",
      fileName: "favorite",
      options: {
        headerShown: true,
      },
    },
    {
      name: "Historial",
      iconName: "history",
      fileName: "history",
      options: {
        headerShown: true,
      },
    },
    {
      name: "Ajustes",
      iconName: "gear",
      fileName: "settings",
      options: {
        headerShown: true,
      },
    },
    // {
    //   name: "Otro",
    //   iconName: "question",
    //   fileName: "pending",
    // },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, false),
        tabBarStyle: {
          height: 60,
          borderColor: theme.background,
        },
        headerStyle: { backgroundColor: theme.tint },
        headerTitleStyle: { color: "white" },
        headerTitle: "Diccionario",
      }}
    >
      {tabs.map((item, index) => (
        <Tabs.Screen
          key={index}
          name={item.fileName}
          options={{
            title: item.name,
            tabBarButton: (props) => (
              <TabButton {...props} theme={theme} item={item} />
            ),
            ...item.options,
          }}
        />
      ))}
    </Tabs>
  );
}

const getStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    tabButtonContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      paddingTop: 5,
    },
    headerContainer: {
      height: 50,
      backgroundColor: colors.tint,
      width: "100%",
      padding: 10,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 22,
      color: colors.background,
      fontWeight: "bold",
    },
  });
