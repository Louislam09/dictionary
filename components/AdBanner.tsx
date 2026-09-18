import React from "react";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { useAdSuppression } from "@/context/AdSuppressionContext";

const GOOGLE_AD_ID =
  (process.env.EXPO_PUBLIC_GOOGLE_BANNER_AD_ID as string) || TestIds.BANNER;
const adUnitId = __DEV__ ? TestIds.BANNER : GOOGLE_AD_ID;

const AdBanner = ({ size }: { size?: keyof typeof BannerAdSize }) => {
  const { isAdsSuppressed, hydrated } = useAdSuppression();
  if (!hydrated || isAdsSuppressed) return null;

  return (
    <BannerAd
      unitId={adUnitId}
      size={size || BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};

export default AdBanner;
