const sequelize = require('../config/database');
const {DataTypes, Sequelize} = require("sequelize");

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('patient', 'pharmacist'),
        defaultValue: 'patient'
    }
});

// SQL CODE FOR THE USER TABLE
// CREATE TABLE users (
//     user_id INT PRIMARY KEY,
//     username VARCHAR(50) NOT NULL UNIQUE,
//     password VARCHAR(100) NOT NULL,
//     first_name VARCHAR(50) NOT NULL,
//     last_name VARCHAR(50) NOT NULL,
//     phone_number VARCHAR(20) NOT NULL,
//     role ENUM('patient', 'pharmacist') DEFAULT 'patient'
// );

module.exports = User;