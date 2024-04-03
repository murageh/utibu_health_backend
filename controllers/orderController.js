const {Medication, Order, Prescription, User} = require("../models");

class OrderResponse {
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
            data: this.data,
        };
    }

    toString() {
        return JSON.stringify(this.toJSON());
    }
}

exports.createOrder = async (req, res) => {
    try {
        const {user_id, prescription_id} = req.body;

        // Check medication stock
        if (!prescription_id) { // invalid request
            return res.status(400).json({message: 'Prescription ID is required'});
        }

        const prescription = await Prescription.findByPk(prescription_id);
        if (!prescription) {
            return res.status(400).json({message: 'Invalid prescription ID'});
        }

        const medicationId = prescription.medication_id;
        const medication = await Medication.findByPk(medicationId);
        if (!medication) {
            return res.status(400).json({message: 'Invalid medication ID'});
        }

        if (medication.stock_level < prescription.quantity) {
            return res.status(400).json({message: 'Insufficient stock level'});
        }

        // actual order creation, reduce stock level
        const newOrder = await Order.create({
            user_id,
            prescription_id,
        });

        // reduce stock level
        medication.stock_level -= prescription.quantity;
        await medication.save();

        newOrder.order_status = 'Verified';
        await newOrder.save();

        console.log('newOrder', newOrder.toJSON());
        return res.status(201).json(new OrderResponse('success', 'Order created successfully', newOrder).toJSON());
    } catch (error) {
        console.log('error creating order', error);
        return res.status(500).json(new OrderResponse('error', 'Failed to create order', null).toJSON());
    }
};

exports.getOrders = async (req, res) => {
    try {
        const role = req.user.role;
        let orders, options = {};

        if (role !== "pharmacist") {
            console.log('role', role, '-> only fetch user orders');
            options = {where: {user_id: req.user.user_id}};
        }
        orders = await Order.findAll({
            ...options,
            include: [
                ...(role === 'pharmacist' ? [
                    {model: User, as: 'user', attributes: {exclude: ['password']},},
                ] : []),
                {
                    model: Prescription, as: 'prescription',
                    include: [
                        {model: Medication, as: 'medication'},
                    ],
                },
            ]
        });
        console.log('getOrders', orders.map(o => o.toJSON()));
        return res.status(200).json(new OrderResponse('success', 'Orders found', orders).toJSON());
    } catch (error) {
        console.log('error fetching orders', error);
        return res.status(500).json(new OrderResponse('error', 'Failed to fetch orders', null).toJSON());
    }
};
