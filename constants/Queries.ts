const SEARCH_Word_QUERY_NEW = `SELECT * FROM dictionary
where topic like ?
order by length(topic) limit 10`;

const GET_FAVORITES = `SELECT * FROM favorite_words order by created_at desc`;
const GET_HISTORY = `SELECT h.*,
CASE 
    WHEN fw.topic IS NOT NULL THEN 1 
    ELSE 0 
END AS isFavorite 
FROM word_history h
LEFT JOIN favorite_words fw 
ON h.topic = fw.topic
order by h.created_at desc`;

const GET_WORD = `SELECT d.*,
CASE 
    WHEN fw.topic IS NOT NULL THEN 1 
    ELSE 0 
END AS isFavorite 
FROM dictionary d
LEFT JOIN favorite_words fw 
ON d.topic = fw.topic
where d.topic = ?`;

const CREATE_FAVORITE_TABLE = `CREATE TABLE IF NOT EXISTS favorite_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT UNIQUE,
  created_at INTEGER
);`;

const INSERT_HISTORY_WORD = `INSERT OR IGNORE INTO word_history (topic, created_at) VALUES (?, ?);`;
const DROP_HISTORY_TABLE = `DROP TABLE word_history;`;
const DELETE_HISTORY_DATA = "DELETE FROM word_history;";
const CREATE_HISTORY_TABLE = `CREATE TABLE IF NOT EXISTS word_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT UNIQUE,
  created_at INTEGER
);`;

const INSERT_FAVORITE_WORD = `INSERT OR IGNORE INTO favorite_words (topic, created_at) VALUES (?, ?);`;
const DELETE_FAVORITE_WORD = `DELETE FROM favorite_words WHERE id = ?;`;

export {
  SEARCH_Word_QUERY_NEW,
  CREATE_FAVORITE_TABLE,
  DELETE_FAVORITE_WORD,
  INSERT_FAVORITE_WORD,
  GET_FAVORITES,
  GET_WORD,
  CREATE_HISTORY_TABLE,
  INSERT_HISTORY_WORD,
  GET_HISTORY,
  DROP_HISTORY_TABLE,
  DELETE_HISTORY_DATA,
};
