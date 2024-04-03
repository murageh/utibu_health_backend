const sequelize = require("../config/database");
const {DataTypes, Sequelize} = require("sequelize");
const {Prescription, Medication, User} = require("./index");

const Order = sequelize.define('Order', {
    order_id: {
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
    order_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    order_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending'
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Unpaid'
    },
    prescription_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Prescriptions',
            key: 'prescription_id'
        }
    }
});

// SQL CODE FOR THE ORDER TABLE
// CREATE TABLE orders (
//     order_id INT PRIMARY KEY,
//     user_id INTEGER NOT NULL,
//     medication_id INTEGER NOT NULL,
//     quantity INTEGER NOT NULL,
//     order_date DATE DEFAULT (CURRENT_DATE),
//     order_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
//     payment_status VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
//     prescription_id INTEGER,
//     FOREIGN KEY (user_id) REFERENCES users(user_id),
//     FOREIGN KEY (medication_id) REFERENCES medications(medication_id),
//     FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id)
// );

module.exports = Order;