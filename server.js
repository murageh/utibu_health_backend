const express = require('express');
const routes = require('./routes/api');
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// sync db
const sequelize = require('./config/database');
const {User, Medication, Order, Prescription, OrderHistory} = require("./models");

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

// sync
sequelize.sync({alter: true})
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch(err => {
        console.error('Unable to sync database:', err);
    });

// Routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// default route
app.get('/', (req, res) => {
    res.send('Welcome to the Pharmacy API');
});
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});