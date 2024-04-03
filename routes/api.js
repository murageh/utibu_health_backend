const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controllers/userController');
const medicationController = require('../controllers/medicationController');
const orderController = require('../controllers/orderController');
const prescriptionController = require('../controllers/prescriptionController');
const orderHistoryController = require('../controllers/orderHistoryController'); // (Optional)

// Middleware
const auth = require('../middleware/authMiddleware');

// User Endpoints
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);
router.get('/users/:id', auth.authenticateUser, userController.getUser);
router.get('/users/profile', auth.authenticateUser, userController.getUserProfile);
router.patch('/users/profile', auth.authenticateUser, userController.updateUserProfile);
router.get('/users', auth.authenticateUser, userController.getUsers);

// Medication Endpoints (Public access for browsing)
router.get('/medication', auth.authenticateUser, medicationController.getMedications);
router.get('/medication/units', auth.authenticateUser, medicationController.getMedicationUnits);
router.get('/medication/:medicationId', auth.authenticateUser, medicationController.getMedicationById);
router.post('/medication', auth.authenticateUser, medicationController.createMedication);
router.put('/medication/:medicationId', auth.authenticateUser, medicationController.updateMedication);
router.patch('/medication/:medicationId/stock', auth.authenticateUser, medicationController.updateMedicationStock);

// Order Endpoints (Requires user authentication)
router.post('/orders', auth.authenticateUser, orderController.createOrder); // Create order with medication or prescription
router.get('/orders', auth.authenticateUser, orderController.getOrders); // Get user's orders
// router.get('/orders/:orderId', auth.authenticateUser, orderController.getOrderById); // Get specific order details by ID (optional)
// router.put('/orders/:orderId/status', auth.authenticateUser, orderController.updateOrderStatus); // Update order status (optional)

// Prescription Endpoints
router.post('/prescriptions', auth.authenticateUser, prescriptionController.createPrescription);
router.get('/prescriptions', auth.authenticateUser, prescriptionController.getPrescriptions); // Get user's prescriptions

// Order History Endpoints (Optional, Requires user authentication)
if (orderHistoryController) {
    router.get('/orders/history', auth.authenticateUser, orderHistoryController.getOrderHistory);
}

module.exports = router;
