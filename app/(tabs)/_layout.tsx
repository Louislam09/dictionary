import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import HeaderTitle from "@/components/HeaderTitle";
import MyTabBar from "@/components/TabBar";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useCustomTheme } from "@/context/ThemeContext";
import { icons } from "lucide-react-native";

export interface ITab {
  name: string;
  iconName: React.ComponentProps<typeof FontAwesome>["name"];
  fileName: string;
  options?: any;
  titleIcon: keyof typeof icons;
}


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useCustomTheme();

  const tabs: ITab[] = [
    {
      name: "Buscar",
      iconName: "search",
      fileName: "index",
      titleIcon: 'Search'
    },
    {
      name: "Favoritos",
      iconName: "heart",
      fileName: "favorite",
      options: {
        headerShown: true,
      },
      titleIcon: 'Star'
    },
    {
      name: "Historial",
      iconName: "history",
      fileName: "history",
      options: {
        headerShown: true,
      },
      titleIcon: 'History'
    },
    {
      name: "Ajustes",
      iconName: "gear",
      fileName: "settings",
      options: {
        headerShown: true,
      },
      titleIcon: 'Settings2'
    },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, false),
        tabBarStyle: {
          height: 80,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerStyle: { backgroundColor: theme.tint },
        headerTitleStyle: { color: "white" },
        // headerTitle: "Diccionario",
      }}
      tabBar={(props) => <MyTabBar key={props.state.index} {...props} />}
    >
      {tabs.map((item, index) => (
        <Tabs.Screen
          key={index}
          name={item.fileName}
          initialParams={{ item }}
          options={{
            title: item.name,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: theme.background,
            },
            ...item.options,
            headerTitle: () => (
              <HeaderTitle titleIcon={item.titleIcon} theme={theme} title={item.name} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}


