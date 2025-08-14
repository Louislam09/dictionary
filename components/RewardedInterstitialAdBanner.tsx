import { useEffect, useState } from "react";
import { Button, StyleSheet, Text } from "react-native";
import {
  AdEventType,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const GOOGLE_AD_ID =
  (process.env.EXPO_PUBLIC_GOOGLE_REWARDED_AD_ID as string) || TestIds.BANNER;
const adUnitId = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : GOOGLE_AD_ID;

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
  adUnitId,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

const RewardedInterstitialAdBanner = () => {
  const [rewardedInterstitialLoaded, setRewardedInterstitialLoaded] =
    useState(false);

  const loadRewardedInterstitial = () => {
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setRewardedInterstitialLoaded(true);
      }
    );

    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log(`User earned reward of ${reward.amount} ${reward.type}`);
      }
    );

    const unsubscribeClosed = rewardedInterstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setRewardedInterstitialLoaded(false);
        rewardedInterstitial.load();
      }
    );

    rewardedInterstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeEarned();
    };
  };

  useEffect(() => {
    const unsubscribeRewardedInterstitialEvents = loadRewardedInterstitial();

    return () => {
      unsubscribeRewardedInterstitialEvents();
    };
  }, []);

  return (
    <>
      {rewardedInterstitialLoaded ? (
        <Button
          title="Show Rewarded Interstitial"
          onPress={() => rewardedInterstitial.show()}
        />
      ) : (
        <Text>Loading Rewarded Interstitial...</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RewardedInterstitialAdBanner;
