const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);
const now = new Date().toLocaleString();

const filename = path.join(__dirname, 'holygrill.db');
const s3Key = 'backups/holygrill.db'; // You can change the path in S3
const bucket = process.env.AWS_S3_BUCKET;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Download the database from S3 if it exists
async function restoreDbFromS3() {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: s3Key
    });

    const response = await s3.send(command);
    await pipeline(response.Body, fs.createWriteStream(filename));
    console.log(`✅ [${now}] Restored DB from S3`);
  } catch (err) {
    console.log(`ℹ️ [${now}] No DB backup found in S3, starting fresh`);
  }
}

// Upload the database to S3 (for backup)
async function backupDbToS3() {
  try {
    const fileStream = fs.createReadStream(filename);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      Body: fileStream,
    });

    await s3.send(command);
    console.log(`✅ [${now}] Backed up DB to S3`);
  } catch (err) {
    console.error(`❌ [${now}] Failed to backup DB to S3:`, err);  }
}

// Initialize the SQLite database
async function openDb() {
  // Restore DB from S3 at startup
  await restoreDbFromS3();

  const db = await open({
    filename,
    driver: sqlite3.Database
  });

  // Back up after some delay or event
  setTimeout(() => {
    backupDbToS3();
  }, 10_000); // backup after 10 seconds of startup

  return db;
}

module.exports = { openDb, backupDbToS3 , restoreDbFromS3};
