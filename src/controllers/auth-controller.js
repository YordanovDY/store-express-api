import { Router } from "express";
import authService from "../services/auth-service.js";

const authController = Router();

authController.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required', status: 400 });
    }

    try {
        await authService.register(email, password);

        res.status(201).json({ message: 'User created', status: 201 });

    } catch (err) {
        if (err.message === 'User already exists') {
            console.error("Registration error:", err.message);
            return res.status(409).json({ message: err.message, status: 409 });
        }

        console.error("Registration error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

export default authController;