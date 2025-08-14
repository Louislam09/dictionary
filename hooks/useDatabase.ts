import {
  CREATE_FAVORITE_TABLE,
  CREATE_HISTORY_TABLE,
} from "@/constants/Queries";
import { DBName } from "@/enums";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";

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

      const statement = await database.prepareAsync(sql);
      try {
        const result = await statement.executeAsync(params);
        const endTime = Date.now();
        const executionTime = endTime - startTime;

        const response = await result.getAllAsync();
        if (queryName) {
          console.log(`Query ${queryName} executed in ${executionTime} ms.`);
        }
        return response as Row[];
      } finally {
        await statement.finalizeAsync();
      }
    } catch (error) {
      console.error(`Error executing SQL "${sql}":`, error);
      throw error; // Re-throw the error instead of returning empty array
    }
  };

  async function createTables(db: SQLite.SQLiteDatabase) {
    const tables = [CREATE_FAVORITE_TABLE, CREATE_HISTORY_TABLE];

    try {
      for (const sql of tables) {
        await db.execAsync(sql);
      }
    } catch (error) {
      console.error("Error creating tables:", error);
      throw error; // Rethrow to handle in the calling function
    }
  }

  async function validateDatabase(db: SQLite.SQLiteDatabase) {
    try {
      // Check if the main dictionary table exists
      const result = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='dictionary'"
      );

      if (result.length === 0) {
        throw new Error("Dictionary table not found in database");
      }

      // Test a simple query on the dictionary table
      // const testResult = await db.getAllAsync(
      //   "SELECT COUNT(*) as count FROM dictionary LIMIT 1"
      // );
      // const count = (testResult[0] as any)?.count || 0;
      // console.log(`Dictionary table contains ${count} records`);

      return true;
    } catch (error) {
      console.error("Database validation failed:", error);
      throw error;
    }
  }

  useEffect(() => {
    async function openDatabase(databaseName: string) {
      setIsDatabaseReady(false);
      const localFolder = FileSystem.documentDirectory + "SQLite";
      const dbName = databaseName;
      const localURI = localFolder + "/" + dbName;

      if (!(await FileSystem.getInfoAsync(localFolder)).exists) {
        await FileSystem.makeDirectoryAsync(localFolder);
      }

      // check if db file exists, if does return db
      if ((await FileSystem.getInfoAsync(localURI)).exists) {
        const db = await SQLite.openDatabaseAsync(dbName);
        return db;
      }

      let asset = Asset.fromModule(require("../assets/db/dictionary.db"));
      if (!asset.downloaded) {
        await asset.downloadAsync().then((value) => {
          asset = value;
          console.log("asset downloadAsync - finished");
        });

        let remoteURI = asset.localUri;

        if (!(await FileSystem.getInfoAsync(localURI)).exists) {
          await FileSystem.copyAsync({
            from: remoteURI as string,
            to: localURI,
          }).catch((error) => {
            console.log("asset copyDatabase - finished with error: " + error);
          });
        }
      } else {
        // for iOS - Asset is downloaded on call Asset.fromModule(), just copy from cache to local file
        if (
          asset.localUri ||
          asset.uri.startsWith("asset") ||
          asset.uri.startsWith("file")
        ) {
          let remoteURI = asset.localUri || asset.uri;

          if (!(await FileSystem.getInfoAsync(localURI)).exists) {
            await FileSystem.copyAsync({
              from: remoteURI,
              to: localURI,
            }).catch((error) => {
              console.log("local copyDatabase - finished with error: " + error);
            });
          }
        } else if (
          asset.uri.startsWith("http") ||
          asset.uri.startsWith("https")
        ) {
          let remoteURI = asset.uri;

          if (!(await FileSystem.getInfoAsync(localURI)).exists) {
            await FileSystem.downloadAsync(remoteURI, localURI).catch(
              (error) => {
                console.log(
                  "local downloadAsync - finished with error: " + error
                );
              }
            );
          }
        }
      }

      const db = await SQLite.openDatabaseAsync(dbName);
      return db;
    }

    openDatabase(DBName.DICTIONARY_SPANISH)
      .then(async (resultDatabase: SQLite.SQLiteDatabase) => {
        if (!resultDatabase) {
          throw new Error("Failed to open database");
        }

        // Test database connection with a simple query
        // try {
        //   await resultDatabase.execAsync("SELECT 1");
        //   console.log("Database connection test successful");
        // } catch (testError) {
        //   console.error("Database connection test failed:", testError);
        //   throw new Error("Database connection test failed");
        // }

        // Validate database structure
        await validateDatabase(resultDatabase);

        await createTables(resultDatabase);
        setDatabase(resultDatabase);
        setIsDatabaseReady(true);
        console.log("DB is ready 🚀");
      })
      .catch((error) => {
        console.log("[Error] opening database:", error);
        setError(`Error opening database: ${error.message}`);
        if (retryOpen > 0) {
          setRetryOpen(retryOpen - 1);
        }
        // setIsDatabaseReady(false);
      })
      .finally(() => {
        setIsDatabaseReady(true);
      });
  }, [retryOpen]);

  return { executeSql, database, isDatabaseReady, error };
}

export default useDatabase;
