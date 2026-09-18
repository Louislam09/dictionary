import { AD_FREE_REWARD_MINUTES } from "@/constants/ads";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AdEventType,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { useAdSuppression } from "./AdSuppressionContext";

const GOOGLE_AD_ID =
  (process.env.EXPO_PUBLIC_GOOGLE_REWARDED_AD_ID as string) ||
  TestIds.REWARDED_INTERSTITIAL;
const adUnitId = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : GOOGLE_AD_ID;

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
  adUnitId,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

type RewardedAdContextValue = {
  rewardedLoaded: boolean;
  showRewarded: () => void;
};

const RewardedAdContext = createContext<RewardedAdContextValue | undefined>(
  undefined
);

export function RewardedAdProvider({ children }: { children: ReactNode }) {
  const { grantAdFreeMinutes } = useAdSuppression();
  const [rewardedLoaded, setRewardedLoaded] = useState(false);

  useEffect(() => {
    const unsubLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setRewardedLoaded(true)
    );

    const unsubEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        grantAdFreeMinutes(AD_FREE_REWARD_MINUTES);
      }
    );

    const unsubClosed = rewardedInterstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setRewardedLoaded(false);
        rewardedInterstitial.load();
      }
    );

    const unsubError = rewardedInterstitial.addAdEventListener(
      AdEventType.ERROR,
      () => setRewardedLoaded(false)
    );

    rewardedInterstitial.load();

    return () => {
      unsubLoaded();
      unsubEarned();
      unsubClosed();
      unsubError();
    };
  }, [grantAdFreeMinutes]);

  const showRewarded = useCallback(() => {
    if (rewardedLoaded) rewardedInterstitial.show();
  }, [rewardedLoaded]);

  const value = useMemo(
    () => ({ rewardedLoaded, showRewarded }),
    [rewardedLoaded, showRewarded]
  );

  return (
    <RewardedAdContext.Provider value={value}>
      {children}
    </RewardedAdContext.Provider>
  );
}

export function useRewardedAd() {
  const ctx = useContext(RewardedAdContext);
  if (!ctx) {
    throw new Error("useRewardedAd must be used within RewardedAdProvider");
  }
  return ctx;
}

export default RewardedAdProvider;
