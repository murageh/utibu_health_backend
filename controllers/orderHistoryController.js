const {Order, OrderHistory} = require("../models");


exports.getOrderHistory = async (req, res) => {
    try {
        const orderHistory = await OrderHistory.findAll({
            where: {user_id: req.user.id}, // Assuming user data is available from middleware
            include: [ // Include related models (optional)
                {model: Order, attributes: ['order_status']}, // Include order details
            ]
        });
        // Send response with user's order history
    } catch (error) {
        // Handle errors while fetching order history (send error response)
    }
};
