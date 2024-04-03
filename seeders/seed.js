const User = require("../models/User");

const sequelize = require('../config/database');
const {Medication, Order, Prescription} = require("../models");

// Sample Data
const users = [
    {
        username: 'patient1',
        password: 'hashed_password',
        first_name: 'John',
        last_name: 'Doe',
        role: 'patient',
        phone_number: '1234'
    },
    {
        username: 'pharmacist1',
        password: 'hashed_password',
        first_name: 'Jane',
        last_name: 'Smith',
        role: 'pharmacist',
        phone_number: '12345'
    },
];

const medications = [
    {name: 'Medication A', description: 'Sample medication for condition A', price: 20.00},
    {name: 'Medication B', description: 'Sample medication for condition B', price: 30.00},
];

const prescriptions = [
    {user_id: 1, medication_id: 1, doctor_name: 'Dr. Green', dosage: 'Take twice daily', refill_count: 1},
    {user_id: 2, medication_id: 2, doctor_name: 'Dr. Brown', dosage: 'Take once daily', refill_count: 3},
];

const orders = [
    {user_id: 1, medication_id: 1, quantity: 1, order_status: 'Confirmed', payment_status: 'Paid', prescription_id: 1},
    {user_id: 2, medication_id: 2, quantity: 2, order_status: 'Pending', payment_status: 'Unpaid'},
];

// Inserting sample data
async function populateData() {
    await User.bulkCreate(users);
    await Medication.bulkCreate(medications);
    await Prescription.bulkCreate(prescriptions);
    await Order.bulkCreate(orders);
}

(async () => {
    try {
        await sequelize.sync({force: true}); // Forces the tables to be recreated (adjust based on your needs)
        await populateData();
        console.log('Sample data populated successfully!');
    } catch (error) {
        console.error('Error populating data:', error);
    } finally {
        await sequelize.close();
    }
})();

