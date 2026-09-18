import { useAdSuppression } from "@/context/AdSuppressionContext";
import { useRewardedAd } from "@/context/RewardedAdContext";

/** Rewarded interstitial controls (single listener set via RewardedAdProvider). */
export function useRewardedInterstitialAd() {
  const { rewardedLoaded, showRewarded } = useRewardedAd();
  const { isAdsSuppressed } = useAdSuppression();
  return {
    loaded: rewardedLoaded,
    show: showRewarded,
    isAdsSuppressed,
  };
}
