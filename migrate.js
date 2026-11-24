/**
 * Database Migration Script
 * Creates the required tables for the application
 * Run with: node migrate.js
 */

require("dotenv").config();
const mysql = require("mysql2/promise");

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PWORD || "",
  database: process.env.DB_NAME || "sample_db",
  // Connection pool settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function runMigration() {
  let connection;

  try {
    console.log("🔄 Connecting to database...");
    console.log(`   Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
    console.log(`   Database: ${DB_CONFIG.database}`);
    console.log(`   User: ${DB_CONFIG.user}`);

    // Create connection without database first (to create DB if needed)
    const adminConnection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
    });

    // Create database if it doesn't exist
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${DB_CONFIG.database}' ready`);

    await adminConnection.end();

    // Now connect to the specific database
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("✅ Connected to database");

    // Create info_users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS info_users (
        fld_id INT AUTO_INCREMENT PRIMARY KEY,
        fld_firstname VARCHAR(100) NOT NULL,
        fld_middlename VARCHAR(100) DEFAULT NULL,
        fld_lastname VARCHAR(100) NOT NULL,
        fld_extname VARCHAR(20) DEFAULT NULL,
        fld_birthdate DATE DEFAULT NULL,
        fld_sexatbirth VARCHAR(20) DEFAULT NULL,
        fld_email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createUsersTable);
    console.log("✅ Table 'info_users' created/verified");

    // Create indexes for better performance
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_email ON info_users(fld_email);
      CREATE INDEX IF NOT EXISTS idx_name ON info_users(fld_firstname, fld_lastname);
    `);
    console.log("✅ Indexes created/verified");

    // Verify table structure
    const [columns] = await connection.query("DESCRIBE info_users");
    console.log("\n📋 Table structure:");
    columns.forEach(col => {
      console.log(`   ${col.Field} - ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key ? `(${col.Key})` : ''} ${col.Default !== null ? `DEFAULT ${col.Default}` : ''}`);
    });

    // Check row count
    const [countResult] = await connection.query("SELECT COUNT(*) as count FROM info_users");
    console.log(`\n📊 Current rows: ${countResult[0].count}`);

    console.log("\n✅ Migration completed successfully!");

  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error.message);

    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Troubleshooting:");
      console.log("   - Is MySQL running?");
      console.log("   - Check DB_HOST, DB_PORT in .env");
      console.log("   - For Railway: use the internal MySQL hostname");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("\n💡 Check DB_USER and DB_PWORD in .env");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.log("\n💡 Database doesn't exist - run with admin privileges first");
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed");
    }
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };