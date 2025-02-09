import { Router } from "express";
import orderService from "../services/order-service.js";
import userService from "../services/user-service.js";
import productService from '../services/product-service.js';
import authService from '../services/auth-service.js';
import { getErrorMessage } from "../utils/error-util.js";
import { ROLES } from "../config/constants.js";

const orderController = Router();

orderController.get('/', async (req, res) => {
    const user = req.user;
    const authRoles = [ROLES.Admin, ROLES.StoreManager, ROLES.Supplier];

    try {
        authService.checkForPermissions(user, authRoles)

    } catch (err) {
        return res.status(403).json({ message: err.message, status: 403 });
    }

    const status = req.options?.status;

    try {
        let result = null;

        if (!status) {
            result = await orderService.getOrders({ status: 'Processing' });
        } else {
            result = await orderService.getOrders({ status });
        }

        res.json(result);

    } catch (err) {
        if (err.message === 'Invalid filter status') {
            return res.status(400).json({ message: err.message, status: 400 });
        }

        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

orderController.get('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const user = req.user;
    const authRoles = [ROLES.Admin, ROLES.StoreManager, ROLES.Supplier];

    try {
        const result = await orderService.getSingleOrder(orderId);

        if (!result) {
            return res.status(404).json({ message: 'Order not found', status: 404 });
        }

        try {
            authService.checkForPermissions(user, authRoles)

        } catch (err) {
            if (result.recipient.id.toString() === user.id) {
                return res.json(result);
            }

            return res.status(403).json({ message: err.message, status: 403 });
        }

        res.json(result);

    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

orderController.post('/', async (req, res) => {
    try {
        const { paymentMethod } = req.body;

        const user = req.user;
        const cart = await userService.getCart(user);

        if (cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty', status: 400 });
        }

        let checkedCart = null;

        try {
            checkedCart = await productService.checkForAvailabilityAndCorrect(cart);

        } catch (err) {
            console.log('Server error: ', err.message);
            return res.status(500).json({ message: err.message, status: 500 });
        }

        if (checkedCart.length === 0) {
            await userService.emptyCart(user);
            return res.status(400).json({ message: 'Cart is empty', status: 400 });
        }

        const result = await orderService.placeAnOrder(user, checkedCart, paymentMethod);
        await userService.emptyCart(user);

        res.status(201).json(result);

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        if (errorMsg.includes('valid enum value')) {
            return res.status(400).json({ message: 'Invalid Payment Method', status: 400 });
        }

        console.error('Server error:', errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

orderController.put('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        await orderService.changeStatus(orderId, status);
        res.json({ message: `Status of order ${orderId} has been changed to ${status}`, status: 200 });

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        if (errorMsg === 'Invalid filter status') {
            return res.status(400).json({ message: errorMsg, status: 400 });
        }

        console.error('Server error:', errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

orderController.delete('/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await orderService.getSingleOrder(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found', status: 404 });
        }

        if (order.status !== 'Processing') {
            return res.status(409).json({ message: 'Cannot cancel an order with status other than [Processing]', status: 409 });
        }

        await orderService.cancelOrder(order);
        res.json({ message: `Order ${orderId} has been cancelled`, status: 200 });

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        console.error('Server error:', errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

export default orderController;