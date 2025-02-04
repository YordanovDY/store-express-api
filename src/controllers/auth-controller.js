import { Router } from "express";
import authService from "../services/auth-service.js";
import 'dotenv/config';

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

authController.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required', status: 400 });
    }

    try {
        const userData = await authService.login(email, password);
        const { token, id, role } = userData;
        const user = {
            id,
            email: userData.email,
            role
        };

        req.session.userData = userData;

        res.status(200)
            .cookie('Auth', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7
            })
            .json({ message: 'Successful login', status: 200, result: { user } });

    } catch (err) {
        if (err.message === 'Invalid user or password') {
            console.error("Registration error:", err.message);
            return res.status(401).json({ message: err.message, status: 401 });
        }

        console.error("Registration error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

authController.get('/user', async (req, res) => {
    const authToken = req.cookies['Auth'];

    if (!authToken) {
        return res.status(401).json({ message: 'Missing authentication token', status: 401 });
    }

    try {
        const tokenData = authService.verifyAuthToken(authToken);
        res.status(200).json({ message: 'Valid authentication token', status: 200, result: { user: tokenData } });

    } catch (err) {
        await authService.clearSessionData(req, res);
        res.status(401).json({ message: err.message, status: 401 });
    }
});

authController.get('/logout', async (req, res) => {
    const authToken = req.cookies['Auth'];

    if (!authToken) {
        return res.status(401).json({ message: 'Missing authentication token', status: 401 });
    }

    try {
        authService.verifyAuthToken(authToken);

    } catch (err) {
        await authService.clearSessionData(req, res);
        return res.status(401).json({ message: err.message, status: 401 });
    }

    try {
        await authService.clearSessionData(req, res);
        res.status(200).json({ message: 'User logged out', status: 200 });

    } catch (err) {
        res.status(500).json({ message: err.message, status: 500 });
    }
});

export default authController;