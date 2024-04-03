import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  AdEventType,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
  TestIds.REWARDED_INTERSTITIAL,
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
