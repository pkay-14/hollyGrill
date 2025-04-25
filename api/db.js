// api/db.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function openDb() {
  return open({
    filename: path.join(__dirname, 'holygrill.db'), // more general name
    driver: sqlite3.Database
  });
}

module.exports = openDb;
