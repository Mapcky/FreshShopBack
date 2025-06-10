require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PASS,
    database: process.env.DB_LOCAL_NAME,
    host: process.env.DB_LOCAL_HOST,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
