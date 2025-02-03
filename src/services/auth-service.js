import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { ROLES } from '../config/constants.js';
import 'dotenv/config';

const { JWT_SECRET } = process.env;

const authService = {
    register,
    login,
    clearSessionData,
    verifyAuthToken,
};

async function register(email, password) {
    const foundUser = await findUser(email);

    if (foundUser) {
        throw new Error('User already exists');
    }

    return User.create({ email, password, role: ROLES.Customer });
}

async function login(email, password) {
    const foundUser = await findUser(email);

    if (!foundUser) {
        throw new Error('Invalid user or password');
    }

    const isValidPassword = await bcrypt.compare(password, foundUser.password);

    if (!isValidPassword) {
        throw new Error('Invalid user or password');
    }

    const payload = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return {
        ...payload,
        token
    };
}

function verifyAuthToken(authToken) {
    return jwt.verify(authToken, JWT_SECRET);
}

function clearSessionData(req, res) {
    return new Promise((resolve, reject) => {
        
        req.session.destroy((err) => {

            if (err) {
                return reject(new Error('Logout failed'));
            }

            res.clearCookie('Auth');
            res.clearCookie('connect.sid');

            resolve();
        });
    });
}

async function findUser(email) {
    return User.findOne({ email });
}

export default authService;