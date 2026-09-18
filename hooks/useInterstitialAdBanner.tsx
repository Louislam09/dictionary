import { useEffect, useState } from "react";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const GOOGLE_AD_ID =
  (process.env.EXPO_PUBLIC_GOOGLE_INTERSTITIAL_AD_ID as string) ||
  TestIds.INTERSTITIAL;
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : GOOGLE_AD_ID;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const useInterstitialAdBanner = () => {
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => setInterstitialLoaded(true)
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setInterstitialLoaded(false);
        interstitial.load();
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      () => {
        setInterstitialLoaded(false);
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  return {
    interstitialLoaded,
    interstitial,
  };
};

export default useInterstitialAdBanner;
