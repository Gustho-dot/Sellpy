import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { open } from "sqlite";

// es modules fix and fallback
const __dirname = import.meta.dirname || dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../src/db/todos.db');

// Database singleton
let dbInstance = null;

export const initDB = async () => {
  try {
    if (!dbInstance) {
      // Create db directory if it doesn't exist
      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });
      
      const setupSQLPath = path.resolve(__dirname, "setup-todos.sql");

      if (fs.existsSync(setupSQLPath)) {
        const sql = fs.readFileSync(setupSQLPath, "utf-8");
        await dbInstance.exec(sql);
      } else {
        console.error("SQL setup file not found at:", setupSQLPath);
      }
    }
    
    return dbInstance;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const closeDB = async () => {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
};