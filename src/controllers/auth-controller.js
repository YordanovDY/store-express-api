import { Router } from "express";
import authService from "../services/auth-service.js";
import clearSessionData from "../utils/clear-session-util.js";
import { AUTH_COOKIE_NAME } from "../config/constants.js";

const authController = Router();

authController.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        await authService.register(email, password);

        res.status(201).json({ message: 'User created', status: 201 });

    } catch (err) {
        if(err.message.includes('range')){
            return res.status(400).json({ message: err.message, status: 400 });
        }

        if(err.message.includes('required')){
            return res.status(400).json({ message: err.message, status: 400 });
        }

        if(err.message.includes('Invalid')){
            return res.status(400).json({ message: err.message, status: 400 });
        }

        if (err.message === 'User already exists') {
            return res.status(409).json({ message: err.message, status: 409 });
        }

        console.error("Server error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

authController.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required', status: 400 });
    }

    try {
        const userData = await authService.login(email, password);
        const { token } = userData;
        const user = userData;

        req.session.userData = userData;

        res.status(200)
            .cookie(AUTH_COOKIE_NAME, token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7
            })
            .json({ message: 'Successful login', status: 200, result: { user } });

    } catch (err) {
        if (err.message === 'Invalid user or password') {
            return res.status(401).json({ message: err.message, status: 401 });
        }

        console.error("Server error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

authController.get('/user', async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Missing authentication token', status: 401 });
    }

    res.status(200).json({ message: 'Valid authentication token', status: 200, result: { user } });
});

authController.get('/logout', async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Missing authentication token', status: 401 });
    }

    try {
        await clearSessionData(req, res);
        res.status(200).json({ message: 'User logged out', status: 200 });

    } catch (err) {
        res.status(500).json({ message: err.message, status: 500 });
    }
});

export default authController;