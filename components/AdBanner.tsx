import { View, Text } from "react-native";
import React from "react";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

const AdBanner = ({ size }: { size?: keyof typeof BannerAdSize }) => {
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
