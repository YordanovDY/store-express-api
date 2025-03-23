import { Router } from 'express';
import userService from '../services/user-service.js';
import { getErrorMessage } from '../utils/error-util.js'
import { requireToken } from '../middlewares/auth-middleware.js';

const userController = Router();

userController.get('/data', requireToken, async (req, res) => {
    const user = req.user;

    try {
        const userInfo = await userService.getUser(user);
        res.json(userInfo);

    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

userController.put('/data', requireToken, async (req, res) => {
    const user = req.user;
    const { fullName, phoneNumber, address } = req.body;

    try {
        await userService.setAdditionalData(user.id, fullName, phoneNumber, address);
        res.json({ message: 'User data updated successfully', status: 200, newData: { id: user.id, fullName, phoneNumber, address } });

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        if (errorMsg.includes('format')) {
            return res.status(400).json({ message: errorMsg, status: 400 });
        }

        console.error('Server error:', errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

userController.get('/cart', requireToken, async (req, res) => {
    const user = req.user;

    try {
        const cartInfo = await userService.getCart(user);
        res.json(cartInfo);

    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

userController.post('/cart', requireToken, async (req, res) => {
    const user = req.user;
    const { item, quantity } = req.body;

    try {
        const cartItem = await userService.getCartItem(user, item);

        if (!cartItem) {
            await userService.addCartItem(user, { item, quantity });
            return res.json({ product: item, quantity });
        }

        if (cartItem.quantity === quantity) {
            return res.status(200).json({ message: 'Not modified item', status: 200 });
        }

        await userService.replaceCartItem(user, { item, quantity });
        res.json({ message: 'Item updated', status: 200, newData: { item, quantity } });

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        if (errorMsg.includes('is required') || errorMsg.includes('positive number')) {
            return res.status(400).json({ message: errorMsg, status: 400 });
        }

        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

userController.delete('/cart/:productId', requireToken, async (req, res) => {
    const user = req.user;

    const { productId } = req.params;

    try {
        await userService.removeCartItem(user, productId);
        res.json({ message: 'Item is removed from the cart', status: 200 });

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        if (errorMsg.includes('Cast to ObjectId failed')) {
            return res.status(404).json({ message: 'Item not found in the cart', status: 404 });
        }

        console.error('Server error:', errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

userController.get('/orders', requireToken, async (req, res) => {
    const user = req.user;
    const result = await userService.getOrders(user);

    try {
        res.json(result);

    } catch (err) {
        const errorMsg = getErrorMessage(err);
        console.error('Server error:', errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

export default userController;