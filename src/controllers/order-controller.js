import { Router } from "express";
import orderService from "../services/order-service.js";
import userService from "../services/user-service.js";
import { getErrorMessage } from "../utils/error-util.js";

const orderController = Router();

orderController.post('/', async (req, res) => {
    try {
        const user = req.user;
        const cart = await userService.getCart(user);

        if (cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty', status: 400 });
        }

        const result = await orderService.placeAnOrder(user, cart);
        await userService.emptyCart(user);

        res.status(201).json(result);

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        console.error('Server error:', errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

export default orderController;