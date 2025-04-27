require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { S3Client } = require("@aws-sdk/client-s3");

const { openDb, restoreDbFromS3, backupDbToS3 } = require('./db');
const {init} = require('./init-db');

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.ENVIRONMENT === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, 'https://' + req.headers.host + req.url);
    }
    next();
  });
}

// Prepare public paths
const distPath = path.join(__dirname, '..', 'dist');
const uploadDir = path.join(__dirname, '..', 'public/images/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(distPath));
app.use('/uploads', express.static(uploadDir));
app.use(express.json());

// AWS S3 Setup
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/\s+/g, '_');
      cb(null, `menu-images/${process.env.ENVIRONMENT}/${timestamp}-${safeName}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  }
});

// API ROUTES
app.post('/api/menu', upload.single('image'), async (req, res) => {
  try {
    const db = await openDb();
    const { name, description, category, price } = req.body;
    const image = req.file ? req.file.location : null;

    const result = await db.run(
      'INSERT INTO menu (name, description, category, price, image) VALUES (?, ?, ?, ?, ?)',
      [name, description, category, price, image]
    );
    await backupDbToS3();
    res.json({ id: result.lastID, name, description, category, price, imageUrl: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

app.get('/api/menu', async (req, res) => {
  const db = await openDb();
  const items = await db.all('SELECT * FROM menu');
  res.json(items.map(item => ({ ...item, imageUrl: item.image || null })));
});

app.get('/api/menu/:id', async (req, res) => {
  const db = await openDb();
  const item = await db.get('SELECT * FROM menu WHERE id = ?', [req.params.id]);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ ...item, imageUrl: item.image || null });
});

app.put('/api/menu/:id', upload.single('image'), async (req, res) => {
  const db = await openDb();
  const { name, description, category, price } = req.body;
  let image = req.file ? req.file.location : null;

  if (!image) {
    const current = await db.get('SELECT image FROM menu WHERE id = ?', [req.params.id]);
    image = current?.image || null;
  }

  try {
    await db.run(
      'UPDATE menu SET name = ?, description = ?, category = ?, price = ?, image = ? WHERE id = ?',
      [name, description, category, price, image, req.params.id]
    );
    await backupDbToS3();
    res.json({ message: 'Updated', imageUrl: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  const db = await openDb();
  await db.run('DELETE FROM menu WHERE id = ?', [req.params.id]);
  await backupDbToS3();
  res.json({ message: 'Deleted' });
});

// Admin
app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO admin_credentials (username, password_hash) VALUES (?, ?)',
      [username, hashed]
    );
    res.json({ message: 'Registered', id: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Register failed' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await openDb();
  const admin = await db.get('SELECT * FROM admin_credentials WHERE username = ?', [username]);
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: admin.id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

app.get('/api/admin/verify-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ error: 'No token' });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isValid: true });
  } catch {
    res.status(401).json({ isValid: false });
  }
});

// Contact Info
app.post('/api/contact', async (req, res) => {
  const { instagram, tiktok, mobile } = req.body;
  try {
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO social_contact_info (instagram, tiktok, mobile) VALUES (?, ?, ?)',
      [instagram, tiktok, mobile]
    );
    await backupDbToS3();
    res.json({ id: result.lastID, instagram, tiktok, mobile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed' });
  }
});

app.get('/api/contact', async (req, res) => {
  const db = await openDb();
  const info = await db.all('SELECT * FROM social_contact_info');
  res.json(info);
});

app.put('/api/contact/:id', async (req, res) => {
  const { instagram, tiktok, mobile } = req.body;
  try {
    const db = await openDb();
    await db.run(
      'UPDATE social_contact_info SET instagram = ?, tiktok = ?, mobile = ? WHERE id = ?',
      [instagram, tiktok, mobile, req.params.id]
    );
    await backupDbToS3();
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/contact/:id', async (req, res) => {
  const db = await openDb();
  await db.run('DELETE FROM social_contact_info WHERE id = ?', [req.params.id]);
  await backupDbToS3();
  res.json({ message: 'Deleted' });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});


(async () => {
  try {
    await restoreDbFromS3(); // Load from S3 first
    await init();            // Create tables if needed
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
})();
