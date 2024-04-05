// import useSearch, { UseSearchHookState } from "hooks/useSearch";
import React, { createContext, useContext, useEffect, useReducer } from "react";
// import useCustomFonts from "../hooks/useCustomFonts";

import dailyWords from "@/constants/dailyWords";
import {
  DELETE_FAVORITE_WORD,
  DELETE_HISTORY_DATA,
  GET_FAVORITES,
  GET_HISTORY,
  GET_WORD,
  INSERT_FAVORITE_WORD,
  INSERT_HISTORY_WORD,
} from "@/constants/Queries";
import { TFavoriteItem } from "@/types";
import { ToastAndroid } from "react-native";
import { useDBContext } from "./DatabaseContext";

type DictionaryState = {
  favoriteWords: TFavoriteItem[];
  historyWords: TFavoriteItem[];
  addOrRemoveFavorite?: (wordData: TFavoriteItem | number) => void;
  fetchWord?: (word: string) => Promise<TFavoriteItem[] | undefined>;
  addWordToHistory?: (word: string) => void;
  deleteHistory?: () => Promise<void>;
  dailyWord?: string;
};

type DictionaryAction =
  | { type: "SET_FAVORITE_DATA"; payload: TFavoriteItem[] }
  | { type: "SET_HISTORY_DATA"; payload: TFavoriteItem[] };

const defaultSearch = {
  searchResults: [],
  error: null,
};

const initialContext: DictionaryState = {
  favoriteWords: [],
  historyWords: [],
};

export const DictionaryContext = createContext<DictionaryState | any>(
  initialContext
);

const DictionaryReducer = (
  state: DictionaryState,
  action: DictionaryAction
): DictionaryState => {
  switch (action.type) {
    case "SET_HISTORY_DATA":
      return {
        ...state,
        historyWords: action.payload,
      };
    case "SET_FAVORITE_DATA":
      return {
        ...state,
        favoriteWords: action.payload,
      };
    default:
      return state;
  }
};

const DictionaryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(DictionaryReducer, initialContext);
  const dailyWord = dailyWords[Math.floor(Math.random() * 100)];
  const { database: myDictionaryDB, executeSql } = useDBContext();

  useEffect(() => {
    fetchFavoriteWords();
    fetchHistoryWords();
  }, [myDictionaryDB]);

  const fetchHistoryWords = () => {
    if (!myDictionaryDB || !executeSql) return;
    executeSql(myDictionaryDB, GET_HISTORY)
      .then((res) => {
        const data = res as TFavoriteItem[];
        dispatch({ type: "SET_HISTORY_DATA", payload: data });
      })
      .catch(console.log);
  };
  const fetchFavoriteWords = () => {
    if (!myDictionaryDB || !executeSql) return;
    executeSql(myDictionaryDB, GET_FAVORITES)
      .then((res) => {
        const data = res as TFavoriteItem[];
        dispatch({ type: "SET_FAVORITE_DATA", payload: data });
      })
      .catch(console.log);
  };

  const deleteHistory = async () => {
    if (!executeSql || !myDictionaryDB) return;
    await executeSql(myDictionaryDB, DELETE_HISTORY_DATA, []);
    ToastAndroid.show("Historial Borrado!", ToastAndroid.SHORT);
    await fetchHistoryWords();
  };

  const fetchWord = async (word: string) => {
    if (!executeSql || !myDictionaryDB) return;
    const data = await executeSql(myDictionaryDB, GET_WORD, [word]);
    return data;
  };

  const addWordToHistory = (word: string) => {
    if (!executeSql || !myDictionaryDB) return;

    executeSql(myDictionaryDB, INSERT_HISTORY_WORD, [word, Date.now()])
      .then(async () => {
        await fetchHistoryWords();
      })
      .catch(console.log);
  };

  const addOrRemoveFavorite = (wordData: TFavoriteItem | number) => {
    if (!executeSql || !myDictionaryDB) return;
    const isID = typeof wordData === "number";
    const query = isID ? DELETE_FAVORITE_WORD : INSERT_FAVORITE_WORD;
    const params = isID ? [wordData] : [wordData.topic, Date.now()];

    executeSql(myDictionaryDB, query, params)
      .then(async () => {
        await fetchFavoriteWords();
        await fetchHistoryWords();
      })
      .catch(console.log);
  };

  const contextValue = {
    ...state,
    addOrRemoveFavorite,
    fetchWord,
    addWordToHistory,
    deleteHistory,
    dailyWord,
  };

  return (
    <DictionaryContext.Provider value={contextValue}>
      {children}
    </DictionaryContext.Provider>
  );
};

export const useDictionaryContext = (): DictionaryState =>
  useContext(DictionaryContext);

export default DictionaryProvider;
