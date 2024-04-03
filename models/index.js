const User = require("./User");
const Medication = require("./Medication");
const Prescription = require("./Prescription");
const Order = require("./Order");
const OrderHistory = require("./OrderHistory");

Medication.hasMany(Prescription, {
    foreignKey: 'medication_id'
});
Prescription.belongsTo(Medication, {
    foreignKey: 'medication_id',
    as: 'medication'
});

User.hasMany(Prescription, {
    foreignKey: 'user_id',
    as: 'prescriptions'
});
Prescription.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'orders'
});
Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Prescription.hasOne(Order, {
    foreignKey: 'prescription_id',
    as: 'order'
});
Order.belongsTo(Prescription, {
    foreignKey: 'prescription_id',
    as: 'prescription'
});

Order.hasOne(OrderHistory, {
    foreignKey: 'order_id'
});

User.hasMany(OrderHistory, {
    foreignKey: 'user_id'
});

module.exports = {User, Medication, Prescription, Order, OrderHistory};