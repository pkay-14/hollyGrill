const openDb = require('./db');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  const db = await openDb();
  const username = 'admin@hollyGrill';
  const plainPassword = 'grilL321.'; // You can change this
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await db.run(`
    INSERT INTO admin_credentials (username, password_hash)
    VALUES (?, ?)
  `, [username, passwordHash]);

  console.log('✅ Admin seeded:');
  console.log(`   username: ${username}`);
}

seedAdmin();
