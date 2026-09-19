import {
  CREATE_FAVORITE_TABLE,
  CREATE_HISTORY_TABLE,
} from "@/constants/Queries";
import { DBName } from "@/enums";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { Platform, ToastAndroid } from "react-native";

interface Row {
  [key: string]: any;
}

interface UseDatabase {
  database: SQLite.SQLiteDatabase | null;
  executeSql: (sql: string, params?: any[], queryName?: any) => Promise<any[]>;
  isDatabaseReady: boolean;
  error: string;
}

export const deleteDatabaseFile = async (dbName: string) => {
  const fileName = `SQLite/${dbName}`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  try {
    await FileSystem.deleteAsync(filePath);
    ToastAndroid.show(
      `File ${fileName} deleted successfully.`,
      ToastAndroid.SHORT
    );
  } catch (error) {
    console.error(`Error deleting file ${fileName}:`, error);
  }
};

function useDatabase(): UseDatabase {
  const [database, setDatabase] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [error, setError] = useState("");
  const [retryOpen, setRetryOpen] = useState(1);

  const executeSql = async (
    sql: string,
    params: any[] = [],
    queryName?: any
  ): Promise<any[]> => {
    try {
      const startTime = Date.now();
      if (!database) {
        console.error("Database is not initialized");
        throw new Error("Database is not initialized");
      }

      if (!isDatabaseReady) {
        console.error("Database is not ready");
        throw new Error("Database is not ready");
      }

      const isSelect = /^\s*(SELECT|PRAGMA|EXPLAIN)/i.test(sql);
      let response: any[];

      if (isSelect) {
        response = await database.getAllAsync(sql, params);
      } else {
        const result = await database.runAsync(sql, params);
        response = [result];
      }

      const endTime = Date.now();
      const executionTime = endTime - startTime;
      if (queryName) {
        console.log(`Query ${queryName} executed in ${executionTime} ms.`);
      }
      return (response || []) as Row[];
    } catch (error) {
      console.error(`Error executing SQL "${sql}":`, error);
      throw error;
    }
  };

  async function createTables(db: SQLite.SQLiteDatabase) {
    const tables = [CREATE_FAVORITE_TABLE, CREATE_HISTORY_TABLE];
    for (const sql of tables) {
      await db.execAsync(sql);
    }
  }

  async function validateDatabase(db: SQLite.SQLiteDatabase) {
    const result = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='dictionary'"
    );

    if (!result || result.length === 0) {
      throw new Error("Dictionary table not found in database");
    }

    return true;
  }

  useEffect(() => {
    let isMounted = true;

    async function copyAssetDatabase(localURI: string) {
      let asset = Asset.fromModule(require("../assets/db/dictionary.db"));
      try {
        if (!asset.downloaded) {
          asset = await asset.downloadAsync();
        }
      } catch (assetErr) {
        console.warn("asset.downloadAsync failed, attempting direct download...", assetErr);
      }

      const remoteURI = asset.localUri || asset.uri;
      if (!remoteURI) {
        throw new Error("Cannot locate dictionary database asset");
      }

      if (remoteURI.startsWith("http://") || remoteURI.startsWith("https://")) {
        try {
          await FileSystem.downloadAsync(remoteURI, localURI);
        } catch (netErr) {
          if (Platform.OS === "android") {
            const localhostURI = remoteURI.replace(/http:\/\/[^/:]+(:[0-9]+)?/, "http://10.0.2.2$1");
            console.log("Retrying download via 10.0.2.2:", localhostURI);
            await FileSystem.downloadAsync(localhostURI, localURI);
          } else {
            throw netErr;
          }
        }
      } else {
        await FileSystem.copyAsync({
          from: remoteURI,
          to: localURI,
        });
      }
    }

    async function initDatabase(databaseName: string) {
      if (!isMounted) return;
      setIsDatabaseReady(false);

      const localFolder = FileSystem.documentDirectory + "SQLite";
      const dbName = databaseName;
      const localURI = localFolder + "/" + dbName;

      const folderInfo = await FileSystem.getInfoAsync(localFolder);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(localFolder, { intermediates: true });
      }

      const fileInfo = await FileSystem.getInfoAsync(localURI);
      const fileExistsAndNotEmpty =
        fileInfo.exists &&
        ("size" in fileInfo ? (fileInfo.size ?? 0) > 0 : true);

      if (!fileExistsAndNotEmpty) {
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(localURI, { idempotent: true });
        }
        await copyAssetDatabase(localURI);
      }

      let db = await SQLite.openDatabaseAsync(dbName);

      try {
        await validateDatabase(db);
      } catch (valErr) {
        console.warn("Database validation failed, attempting to recreate from asset...", valErr);
        await db.closeAsync().catch(() => {});
        await FileSystem.deleteAsync(localURI, { idempotent: true });
        await copyAssetDatabase(localURI);
        db = await SQLite.openDatabaseAsync(dbName);
        await validateDatabase(db);
      }

      await createTables(db);

      if (isMounted) {
        setDatabase(db);
        setIsDatabaseReady(true);
        setError("");
        console.log("DB is ready 🚀");
      }
    }

    initDatabase(DBName.DICTIONARY_SPANISH).catch((err) => {
      console.error("[Error] opening database:", err);
      if (isMounted) {
        setError(`Error opening database: ${err.message}`);
        setIsDatabaseReady(false);
        if (retryOpen > 0) {
          setTimeout(() => {
            if (isMounted) setRetryOpen((prev) => prev - 1);
          }, 1000);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [retryOpen]);

  return { executeSql, database, isDatabaseReady, error };
}

export default useDatabase;
