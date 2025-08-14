import { View, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { MyColors } from '@/constants/themeColors';
import { useCustomTheme } from '@/context/ThemeContext';
import MyIcon from '@/components/MyIcon';
import { icons } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';

// Tab configuration with icons
const tabConfig: Record<string, { icon: keyof typeof icons; label: string }> = {
    index: { icon: 'Search', label: 'Buscar' },
    favorite: { icon: 'Star', label: 'Favoritos' },
    history: { icon: 'History', label: 'Historial' },
    settings: { icon: 'Settings2', label: 'Ajustes' },
};

function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { theme: colors } = useCustomTheme();
    const { buildHref } = useLinkBuilder();
    const styles = getStyles(colors);

    return (
        <View style={styles.tabBar}>
            <View style={styles.tabContainer}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const config = tabConfig[route.name] || { icon: 'Circle', label: route.name };
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TabButton
                            key={route.name}
                            isFocused={isFocused}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            icon={config.icon}
                            label={config.label}
                            colors={colors}
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarButtonTestID}
                        />
                    );
                })}
            </View>
        </View>
    );
}

interface TabButtonProps {
    isFocused: boolean;
    onPress: () => void;
    onLongPress: () => void;
    icon: keyof typeof icons;
    label: string;
    colors: MyColors;
    accessibilityState?: any;
    accessibilityLabel?: string;
    testID?: string;
}

function TabButton({
    isFocused,
    onPress,
    onLongPress,
    icon,
    label,
    colors,
    accessibilityState,
    accessibilityLabel,
    testID
}: TabButtonProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(isFocused ? 1 : 0.6);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1.1 : 1, {
            damping: 15,
            stiffness: 150,
        });
        opacity.value = withSpring(isFocused ? 1 : 0.6);
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const styles = getStyles(colors);

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            accessibilityState={accessibilityState}
            accessibilityLabel={accessibilityLabel}
            testID={testID}
            activeOpacity={0.7}
        >
            <Animated.View style={[styles.tabButtonContent, animatedStyle]}>
                <View style={[
                    styles.iconContainer,
                    isFocused && styles.iconContainerActive
                ]}>
                    <MyIcon
                        name={icon}
                        size={22}
                        color={colors.text}
                    />
                </View>
                <Text style={[
                    styles.tabLabel,
                ]}>
                    {label}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
}

const getStyles = (colors: MyColors) =>
    StyleSheet.create({
        tabBar: {
            backgroundColor: colors.background,
            paddingBottom: Platform.select({ ios: 34, android: 10 }),
            paddingTop: 8,
            paddingHorizontal: 16,
            borderTopWidth: 0.5,
            borderTopColor: colors.text + '20',
        },
        tabContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        tabButton: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 8,
        },
        tabButtonContent: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconContainer: {
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
        },
        iconContainerActive: {
            backgroundColor: colors.tint + 99,
            paddingHorizontal: 20
        },
        tabLabel: {
            fontSize: 11,
            fontWeight: '500',
            textAlign: 'center',
            color: colors.text,
        },
    });


export default MyTabBar