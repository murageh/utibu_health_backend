const sequelize = require("../config/database");
const {DataTypes} = require("sequelize");

const Medication = sequelize.define('Medication', {
    medication_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock_level: {
        type: DataTypes.INTEGER,
        defaultValue: 10 // Adjust default stock level as needed
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = Medication;