import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
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

const primaryColor = "#0097f6";

const TabButton = (props: { [key: string]: any } & { item: ITab }) => {
  const {
    accessibilityState: { selected },
    onPress,
    item,
  } = props;
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
            backgroundColor: selected ? "white" : primaryColor,
          },
          // animatedStyles,
        ]}
      >
        <TabBarIcon
          iconStyle={{ marginBottom: -3 }}
          name={item.iconName}
          color={selected ? primaryColor : "white"}
        />
        <Text style={{ color: selected ? "black" : "white" }}>{item.name}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
    },
    {
      name: "Ajustes",
      iconName: "gear",
      fileName: "settings",
    },
    {
      name: "Otro",
      iconName: "question",
      fileName: "pending",
    },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, false),
        tabBarStyle: {
          height: 60,
          borderColor: "transparent",
        },
      }}
    >
      {tabs.map((item, index) => (
        <Tabs.Screen
          key={index}
          name={item.fileName}
          options={{
            title: item.name,
            tabBarButton: (props) => <TabButton {...props} item={item} />,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingTop: 5,
  },
  activeBackground: {
    position: "absolute",
  },
});
