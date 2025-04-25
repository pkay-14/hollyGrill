const openDb = require('./db');

async function init() {
  const db = await openDb();

  // Create the menu table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      price REAL,
      image TEXT
    )
  `);
  console.log('✅ Table "menu" is ready inside holygrill.db');

  // Create the social_contact_info table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS social_contact_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      instagram TEXT,
      tiktok TEXT,
      mobile TEXT
    )
  `);
  console.log('✅ Table "social_contact_info" is ready inside holygrill.db');

  // Create the admin_credentials table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )
  `);
  console.log('✅ Table "admin_credentials" is ready inside holygrill.db');
}

init();
