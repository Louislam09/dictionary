/** ~1 in 3 navigations may show an interstitial when other rules allow. */
export const showRandomAd = () => {
  const RANDOM_AD = [-1, 0, 1];
  const randomNumber = Math.floor(Math.random() * RANDOM_AD.length);
  return RANDOM_AD[randomNumber] === 0;
};

const INTERSTITIAL_COOLDOWN_MS = 90_000;
const MAX_INTERSTITIALS_PER_SESSION = 12;

let interstitialsThisSession = 0;
let lastInterstitialAt = 0;

export function canShowInterstitial(): boolean {
  if (!showRandomAd()) return false;
  if (interstitialsThisSession >= MAX_INTERSTITIALS_PER_SESSION) return false;
  if (Date.now() - lastInterstitialAt < INTERSTITIAL_COOLDOWN_MS) return false;
  return true;
}

export function recordInterstitialShown(): void {
  interstitialsThisSession += 1;
  lastInterstitialAt = Date.now();
}

/** Rewarded flow: minutes without banners or interstitials after a completed view. */
export const AD_FREE_REWARD_MINUTES = 5;
