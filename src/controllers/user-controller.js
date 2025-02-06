import { Router } from "express";
import userService from "../services/user-service.js";
import { getErrorMessage } from "../utils/error-util.js"

const userController = Router();

userController.get('/data', async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Missing authentication token', status: 401 });
    }

    try {
        const userInfo = await userService.getUser(user);
        res.json(userInfo);

    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

userController.put('/data', async (req, res) => {
    const user = req.user;
    const { fullName, phoneNumber, address } = req.body;

    if (!user) {
        return res.status(401).json({ message: 'Missing authentication token', status: 401 });
    }

    try {
        const result = await userService.setAdditionalData(user.id, fullName, phoneNumber, address);
        res.json({ message: 'User data updated successfully', status: 200, newData: { id: user.id, fullName, phoneNumber, address } });

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        if (errorMsg.includes("format")) {
            return res.status(400).json({ message: errorMsg, status: 400 });
        }

        console.error("Server error:", errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

userController.get('/cart', async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Missing authentication token', status: 401 });
    }

    try {
        const cartInfo = await userService.getCart(user);
        res.json(cartInfo);

    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

userController.put('/cart', async (req, res) => {
    const user = req.user;
    const { item, quantity } = req.body;

    if (!user) {
        return res.status(401).json({ message: 'Missing authentication token', status: 401 });
    }

    try {
        const cartItem = await userService.getCartItem(user, item);

        if (!cartItem) {
            const result = await userService.addCartItem(user, { item, quantity });
            return res.json(result);
        }

        if (cartItem.quantity === quantity) {
            return res.status(200).json({ message: 'Not modified item', status: 200 });
        }

        await userService.replaceCartItem(user, { item, quantity });
        res.json({ message: 'Item updated', status: 200, newData: { item, quantity } });

    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

export default userController;