import mysql from "mysql2/promise";

// Hardcode the values temporarily to fix the issue
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "tripplanner",
});

// Test connection
db.getConnection()
  .then((connection) => {
    console.log("✓ Database connected successfully");
    connection.release();
  })
  .catch((error) => {
    console.error("✗ Database connection failed:", error);
  });

export default db;

/*
REQUIRED RUNTIME:
- MySQL server must be running
- Next.js dev server must be running (npm run dev)
- .env.local must be configured correctly

HOW TO START MYSQL ON WINDOWS:
- Run PowerShell as Administrator
- Run: net start MySQL80
- If fails: Get-Service *mysql*
- Then run: net start "SERVICE_NAME"

VERIFICATION IN MYSQL WORKBENCH:
- SHOW DATABASES;
- USE tripplanner;
- SHOW TABLES;
- users table must exist

EXPECTED SQL TABLE STRUCTURE:
users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
*/
