import { MyColors } from "@/constants/themeColors";
import MyIcon from "./MyIcon";
import { Text, View } from "./Themed";
import { icons } from "lucide-react-native";

export const headerIconSize = 25;

interface HeaderTitleProps {
    title: string;
    titleIcon: keyof typeof icons;
    titleIconColor?: string;
    mainIconSize?: number;
    headerIconSize?: number;
    theme: MyColors
}

const HeaderTitle = ({ title, mainIconSize, titleIcon, titleIconColor, theme }: HeaderTitleProps) => {
    const styles = {
        headerTitle: {
            gap: 4,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "transparent",
        },
    } as any;

    return (
        <View style={styles.headerTitle}>
            <MyIcon
                name={titleIcon}
                color={titleIconColor || theme.tint}
                size={mainIconSize || headerIconSize}
            />
            <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 22, color: theme.text }}>
                {title}
            </Text>
        </View>
    )
}

export default HeaderTitle;