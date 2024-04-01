import * as SQLite from "expo-sqlite";
import React, { createContext, useContext } from "react";
import useDatabase from "../hooks/useDatabase";

interface Row {
  [key: string]: any;
}

type DatabaseContextType = {
  database?: SQLite.SQLiteDatabase | null;
  executeSql?:
    | ((
        db: SQLite.SQLiteDatabase,
        sql: string,
        params?: any[]
      ) => Promise<Row[]>)
    | null;
};

const initialContext = {
  database: null,
};

export const DatabaseContext =
  createContext<DatabaseContextType>(initialContext);

const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { database, executeSql } = useDatabase();

  const dbContextValue = {
    database,
    executeSql,
  };

  return (
    <DatabaseContext.Provider value={dbContextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDBContext = (): DatabaseContextType =>
  useContext(DatabaseContext);

export default DatabaseProvider;
