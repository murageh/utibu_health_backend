const sequelize = require("../config/database");
const {DataTypes} = require("sequelize");
const {User, Order} = require("./index");

const OrderHistory = sequelize.define('OrderHistory', {
    order_history_id: {
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
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'order_id'
        }
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
});

module.exports = OrderHistory;