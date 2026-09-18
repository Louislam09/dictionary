import { StorageKeys } from "@/constants/StorageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AdSuppressionContextValue = {
  isAdsSuppressed: boolean;
  grantAdFreeMinutes: (minutes: number) => Promise<void>;
  hydrated: boolean;
};

const AdSuppressionContext = createContext<
  AdSuppressionContextValue | undefined
>(undefined);

export function AdSuppressionProvider({ children }: { children: ReactNode }) {
  const [adFreeUntil, setAdFreeUntil] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [timeTick, setTimeTick] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(StorageKeys.AD_FREE_UNTIL).then((v) => {
      if (v) {
        const n = parseInt(v, 10);
        if (!Number.isNaN(n)) setAdFreeUntil(n);
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (adFreeUntil <= Date.now()) return;
    const id = setInterval(() => setTimeTick((x) => x + 1), 15_000);
    return () => clearInterval(id);
  }, [adFreeUntil]);

  const grantAdFreeMinutes = useCallback(async (minutes: number) => {
    setAdFreeUntil((prev) => {
      const base = Math.max(Date.now(), prev);
      const until = base + minutes * 60_000;
      void AsyncStorage.setItem(StorageKeys.AD_FREE_UNTIL, String(until));
      return until;
    });
  }, []);

  const value = useMemo(() => {
    const isAdsSuppressed = Date.now() < adFreeUntil;
    return { isAdsSuppressed, grantAdFreeMinutes, hydrated };
  }, [adFreeUntil, grantAdFreeMinutes, hydrated, timeTick]);

  return (
    <AdSuppressionContext.Provider value={value}>
      {children}
    </AdSuppressionContext.Provider>
  );
}

export function useAdSuppression() {
  const ctx = useContext(AdSuppressionContext);
  if (!ctx) {
    throw new Error("useAdSuppression must be used within AdSuppressionProvider");
  }
  return ctx;
}

export default AdSuppressionProvider;
