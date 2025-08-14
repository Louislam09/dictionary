import * as SQLite from "expo-sqlite";
import React, { createContext, useContext } from "react";
import useDatabase from "../hooks/useDatabase";
import { Text, View } from "@/components/Themed";
import { ActivityIndicator, Dimensions, Image } from "react-native";
import useTheme from "@/hooks/useTheme";
import Animation from "@/components/Animation";

interface Row {
  [key: string]: any;
}
const { width } = Dimensions.get('window');

type DatabaseContextType = {
  database?: SQLite.SQLiteDatabase | null;
  executeSql: <T = any>(
    sql: string,
    params?: any[],
    queryName?: string
  ) => Promise<T[]>;
  // executeSql?:
  //   | ((
  //       db: SQLite.SQLiteDatabase,
  //       sql: string,
  //       params?: any[]
  //     ) => Promise<Row[]>)
  //   | null;
};

const initialContext = {
  database: null,
  executeSql: async (sql: string, params?: any[], queryName?: string) => [],
};

export const DatabaseContext =
  createContext<DatabaseContextType>(initialContext);

const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { database, executeSql, isDatabaseReady, error } = useDatabase();
  const theme = useTheme()

  const dbContextValue = {
    database,
    executeSql,
  };

  if (!isDatabaseReady || !database) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
      <Animation
        backgroundColor={"transparent"}
        source={require('@/assets/lottie/loading-book.json')}
        loop={true}
      />
      {/* <ActivityIndicator color={theme.tint} size="large" /> */}
      <Text>Cargando...</Text>
    </View>
  }

  return (
    <DatabaseContext.Provider value={dbContextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDBContext = (): DatabaseContextType =>
  useContext(DatabaseContext);

export default DatabaseProvider;
