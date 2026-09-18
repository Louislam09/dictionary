import { AD_FREE_REWARD_MINUTES } from "@/constants/ads";
import { useCustomTheme } from "@/context/ThemeContext";
import { useAdSuppression } from "@/context/AdSuppressionContext";
import { useRewardedInterstitialAd } from "@/hooks/useRewardedInterstitialAd";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text } from "./Themed";

export default function RewardedAdFreeOffer() {
  const { theme } = useCustomTheme();
  const { hydrated } = useAdSuppression();
  const { loaded, show, isAdsSuppressed } = useRewardedInterstitialAd();

  if (!hydrated) return null;

  if (isAdsSuppressed) {
    return (
      <Text style={[styles.hint, { color: theme.textSecondary }]}>
        Sin anuncios activos
      </Text>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: theme.tint,
          borderColor: theme.textSecondary + "90",
        },
      ]}
      onPress={show}
      disabled={!loaded}
      activeOpacity={0.85}
    >
      {!loaded ? (
        <ActivityIndicator color={theme.text} />
      ) : (
        <Text style={[styles.label, { color: theme.text }]}>
          Ver anuncio · {AD_FREE_REWARD_MINUTES} min sin anuncios
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  hint: {
    marginTop: 10,
    fontSize: 13,
    textAlign: "center",
  },
});
