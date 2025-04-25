const openDb = require('./db');

async function seedContactInfo() {
  const db = await openDb();
  await db.run(`
    INSERT INTO social_contact_info (instagram, tiktok, mobile)
    VALUES (?, ?, ?)
  `, ['holygrillgh', 'holygrillgh', '+233 501076005']);

  console.log('✅ Contact info seeded');
}

seedContactInfo();
