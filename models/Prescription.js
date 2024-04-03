const sequelize = require("../config/database");
const {DataTypes, Sequelize} = require("sequelize");
const {User, Medication} = require("./index");

const Prescription = sequelize.define('Prescription', {
    prescription_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id'
        }
    },
    medication_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Medications',
            key: 'medication_id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    doctor_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prescription_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refill_count: {
        type: DataTypes.INTEGER,
        defaultValue: 2 // Adjust default refill count as needed
    }
});

module.exports = Prescription;