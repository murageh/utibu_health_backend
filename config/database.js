const {Sequelize} = require('sequelize');
require('dotenv').config()

const {DB_HOST, DB_USERNAME, DB_DATABASE, DB_PASSWORD} = process.env;
console.log({DB_HOST, DB_USERNAME, DB_DATABASE, DB_PASSWORD})

const sequelize = new Sequelize(
    DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'mysql',
        logging: true,
    });

// const sequelize = new Sequelize('sqlite::memory:', {
//     logging: true,
// });

module.exports = sequelize;