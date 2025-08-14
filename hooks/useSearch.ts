import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { SEARCH_Word_QUERY_NEW } from "@/constants/Queries";
import { useDBContext } from "@/context/DatabaseContext";

export interface UseSearchHookState {
  searchResults: any[] | null;
  error: Error | null | string;
}

interface UseSearchHook {
  state: UseSearchHookState;
  performSearch: (query: string, abortController: AbortController) => void;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

const useSearch = (): UseSearchHook => {
  const { executeSql } = useDBContext();
  const [state, setState] = useState<UseSearchHookState>({
    searchResults: null,
    error: null,
  });

  const setSearchTerm: Dispatch<SetStateAction<string>> = (query) => {
    setState((prev) => ({ ...prev, searchResults: [], error: null }));
  };

  const searchInDatabase = async (
    query: string,
    abortController: AbortController
  ): Promise<any[]> => {
    const word = query;

    return new Promise(async (resolve, reject) => {
      abortController.signal.addEventListener("abort", () => {
        setState({ searchResults: null, error: "Search aborted" });
        reject(new Error(`Search aborted: ${query}`));
      });

      try {
        const results = await executeSql(
          SEARCH_Word_QUERY_NEW,
          [`%${word}%`],
          "search"
        );
        if (!abortController.signal.aborted) {
          resolve(results);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          reject(error);
        }
      }
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
      console.error("Search error:", error);
      setState({
        searchResults: null,
        error: error.message || "Search failed",
      });
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
