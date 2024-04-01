import { useState, useEffect, Dispatch, SetStateAction } from "react";
import * as SQLite from "expo-sqlite";
import { SEARCH_Word_QUERY_NEW } from "@/constants/Queries";

export interface UseSearchHookState {
  searchResults: any[] | null;
  error: Error | null | string;
}

interface UseSearchHook {
  state: UseSearchHookState;
  performSearch: (query: string, abortController: AbortController) => void;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

type UseSearch = {
  db: SQLite.SQLiteDatabase | null | undefined;
};

const useSearch = ({ db }: UseSearch): UseSearchHook => {
  const [state, setState] = useState<UseSearchHookState>({
    searchResults: null,
    error: null,
  });

  const setSearchTerm: Dispatch<SetStateAction<string>> = (query) => {
    setState((prev) => ({ ...prev, searchResults: [], error: null }));
  };

  const searchInDatabase = (
    query: string,
    abortController: AbortController
  ): Promise<any[]> => {
    const word = query

    return new Promise((resolve, reject) => {
      if (!db) return true;

      abortController.signal.addEventListener("abort", () => {
        setState({ searchResults: null, error: "Search aborted" });
        reject(new Error(`Search aborted: ${query}`));
      });

      const myQuery = SEARCH_Word_QUERY_NEW
      db.transaction((tx) => {
        tx.executeSql(
          `${myQuery}`,
          [`%${word}%`],
          (_, { rows }) => {
            if (!abortController.signal.aborted) {
              const results: any[] = [];
              for (let i = 0; i < rows.length; i++) {
                results.push(rows.item(i));
              }
              resolve(results);
            }
          },
          (_, error) => {
            if (!abortController.signal.aborted) {
              reject(error);
            }
            return true;
          }
        );
      });
    });
  };

  const performSearch = async (
    query: string,
    abortController: AbortController
  ): Promise<void> => {
    try {
      const results = await searchInDatabase(query, abortController);
      setState({ searchResults: results ?? [], error: null });
    } catch (error: any) {
      setState({ searchResults: null, error });
    }
  };

  useEffect(() => {
    let isMounted = true;

    return () => {
      isMounted = false;
    };
  }, []);

  return { state, performSearch, setSearchTerm };
};

export default useSearch;
