import { CREATE_FAVORITE_TABLE, CREATE_HISTORY_TABLE } from "@/constants/Queries";
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
  executeSql: (
    database: SQLite.SQLiteDatabase,
    sql: string,
    params?: any[]
  ) => Promise<Row[]>;
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

  const executeSql = (
    database: SQLite.SQLiteDatabase,
    sql: string,
    params: any[] = []
  ): Promise<Row[]> => {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject(new Error("Database not initialized"));
      } else {
        database.transaction((tx) => {
          tx.executeSql(
            sql,
            params,
            (_, { rows }) => {
              resolve(rows._array);
            },
            (tx, error) => {
              reject(error);
              return true;
            }
          );
        });
      }
    });
  };

  async function createTable(database: SQLite.SQLiteDatabase, createTableQuery: string) {
    try {
      await executeSql(database, createTableQuery);
    } catch (error) {
      console.error(`Error creating table ${createTableQuery}:`, error);
    }
  }

  useEffect(() => {
    async function openDatabase(databaseName: string) {
      const localFolder = FileSystem.documentDirectory + "SQLite";
      const dbName = databaseName;
      const localURI = localFolder + "/" + dbName;

      if (!(await FileSystem.getInfoAsync(localFolder)).exists) {
        await FileSystem.makeDirectoryAsync(localFolder);
      }

      let asset = Asset.fromModule(require("../assets/db/dictionary.db"))

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

      return SQLite.openDatabase(dbName);
    }

    openDatabase(DBName.DICTIONARY_SPANISH)
      .then(async (resultDatabase: SQLite.SQLiteDatabase) => {
        await createTable(resultDatabase, CREATE_FAVORITE_TABLE);
        await createTable(resultDatabase, CREATE_HISTORY_TABLE);
        setDatabase(resultDatabase);
      })
      .catch(console.log);
  }, []);

  return { executeSql, database };
}

export default useDatabase;
