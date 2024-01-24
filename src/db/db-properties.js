const mongoose = require('mongoose');
require('dotenv').config();

let connection;

if (process.env.NODE_ENV === 'development') {
  mongoose.connect(process.env.DB_DEV_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  connection = mongoose.connection;

  connection.on('error', (err) => {
    console.error('Database connection failure:', err);
    process.exit(1);
  });

  connection.once('open', () => {
    console.log('Connected to the database');
  });
}

module.exports = connection;
