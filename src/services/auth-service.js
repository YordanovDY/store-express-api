import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { ROLES } from '../config/constants.js';
import 'dotenv/config';

const { JWT_SECRET } = process.env;

const authService = {
    register,
    login,
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

async function findUser(email) {
    return User.findOne({ email });
}

export default authService;