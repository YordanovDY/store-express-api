import { Router } from "express";
import orderService from "../services/order-service.js";
import userService from "../services/user-service.js";
import { getErrorMessage } from "../utils/error-util.js";

const orderController = Router();

orderController.post('/', async (req, res) => {
    try {
        const user = req.user;
        const cart = await userService.getCart(user);
        const result = await orderService.placeAnOrder(user, cart);
        res.json(result);

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        console.error('Server error:', errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

export default orderController;