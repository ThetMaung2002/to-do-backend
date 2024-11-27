import sqlite3 from 'sqlite3';
import path from 'path';

const DATABASE_FILE = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(DATABASE_FILE, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

const initializeDatabase = (): void => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE
    );
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error initializing database:', err.message);
      return;
    }
    console.log('Database initialized successfully.');
  });
};

initializeDatabase();

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

export { db, initializeDatabase };