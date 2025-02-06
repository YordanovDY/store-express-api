import { Router } from "express";
import userService from "../services/user-service.js";

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

export default userController;