const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db');

db.serialize(() => {
  db.run(`
          CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY,
            scanId TEXT,
            repoName TEXT,
            findings TEXT NULL,
            status TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            timeStart TIMESTAMP NULL,
            timeEnd TIMESTAMP NULL
          )
        `);
});

module.exports = db;

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    return process.exit(0);
  });
});
