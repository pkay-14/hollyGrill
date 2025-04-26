require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");


const AWS = require('aws-sdk');
const openDb = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, '..', 'dist');
const uploadDir = path.join(__dirname, '..', 'public/images/uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from public and dist folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(distPath));
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(uploadDir));

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
// Multer-S3 Storage Configuration
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/\s+/g, '_');
      cb(null, `menu-images/${timestamp}-${safeName}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
    cb(null, true);
  },
});

app.use(express.json());

// ✅ API ROUTES

// POST /api/menu with image upload
app.post('/api/menu', upload.single('image'), async (req, res) => {
  try {
    const db = await openDb();
    const { name, description, category, price } = req.body;
    const image = req.file ? req.file.location : null;

    const result = await db.run(
      'INSERT INTO menu (name, description, category, price, image) VALUES (?, ?, ?, ?, ?)',
      [name, description, category, price, image]
    );

    res.json({
      id: result.lastID,
      name,
      description,
      category,
      price,
      image,
      imageUrl: image ? image : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// GET all menu items
app.get('/api/menu', async (req, res) => {
  const db = await openDb();
  const items = await db.all('SELECT * FROM menu');
  const formatted = items.map((item) => ({
    ...item,
    imageUrl: item.image ? item.image : null,
  }));
  res.json(formatted);
});

// GET one menu item
app.get('/api/menu/:id', async (req, res) => {
  const db = await openDb();
  const item = await db.get('SELECT * FROM menu WHERE id = ?', [req.params.id]);

  if (!item) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json({
    ...item,
    imageUrl: item.image ? item.image : null,
  });
});

// PUT /api/menu/:id (optional: handle image updates if needed)
app.put('/api/menu/:id', upload.single('image'), async (req, res) => {
  const db = await openDb();

  const { name, description, category, price } = req.body;

  // Check if new image is uploaded
  let image = req.file ? req.file.location : null;

  // If no new image is uploaded, use the existing image from the database
  if (!image) {
    const currentItem = await db.get('SELECT * FROM menu WHERE id = ?', [req.params.id]);
    if (currentItem && currentItem.image) {
      image = currentItem.image; // keep the old image
    }
  }

  try {
    await db.run(
      'UPDATE menu SET name = ?, description = ?, category = ?, price = ?, image = ? WHERE id = ?',
      [name, description, category, price, image, req.params.id]
    );

    res.json({
      message: 'Menu item updated successfully',
      id: req.params.id,
      name,
      description,
      category,
      price,
      image,
      imageUrl: image ? image : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// DELETE /api/menu/:id
app.delete('/api/menu/:id', async (req, res) => {
  const db = await openDb();
  await db.run('DELETE FROM menu WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

// Admin Authentication Routes
// POST /api/admin/register
app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body;
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO admin_credentials (username, password_hash) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.json({ message: 'Admin registered successfully', id: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register admin' });
  }
});

// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  const db = await openDb();
  const admin = await db.get('SELECT * FROM admin_credentials WHERE username = ?', [username]);

  if (!admin) {
    return res.status(404).json({ error: 'Admin not found' });
  }

  // Compare provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, admin.password_hash);

  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Generate a JWT token with a payload (e.g., admin ID, username)
  const token = jwt.sign(
    { id: admin.id, username: admin.username }, // Payload
    process.env.JWT_SECRET, // Secret key to sign the token
    { expiresIn: '1h' } // Token expiration time (optional)
  );

  // Send the token to the client
  res.json({ message: 'Login successful', token });
});

app.get('/api/admin/verify-token', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Verify the token
    res.json({ isValid: true });
  } catch (err) {
    res.status(401).json({ isValid: false, error: 'Invalid token' });
  }
});

// Contact Info Routes
// POST /api/contact
app.post('/api/contact', async (req, res) => {
  const { instagram, tiktok, mobile } = req.body;

  try {
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO social_contact_info (instagram, tiktok, mobile) VALUES (?, ?, ?)',
      [instagram, tiktok, mobile]
    );

    res.json({
      id: result.lastID,
      instagram,
      tiktok,
      mobile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add contact info' });
  }
});

// GET contact info
app.get('/api/contact', async (req, res) => {
  const db = await openDb();
  const contactInfo = await db.all('SELECT * FROM social_contact_info');
  res.json(contactInfo);
});

// PUT /api/contact/:id
app.put('/api/contact/:id', async (req, res) => {
  const { instagram, tiktok, mobile } = req.body;

  try {
    const db = await openDb();
    await db.run(
      'UPDATE social_contact_info SET instagram = ?, tiktok = ?, mobile = ? WHERE id = ?',
      [instagram, tiktok, mobile, req.params.id]
    );

    res.json({ message: 'Contact info updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update contact info' });
  }
});

// DELETE /api/contact/:id
app.delete('/api/contact/:id', async (req, res) => {
  const db = await openDb();
  await db.run('DELETE FROM social_contact_info WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted contact info' });
});

// ⚠️ Catch-all to serve SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
