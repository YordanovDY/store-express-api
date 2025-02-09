import bcrypt from 'bcrypt';
import User from "../models/User.js";
import { ROLES } from '../config/constants.js';
import { getErrorMessage } from '../utils/error-util.js'
import asyncJWT from '../utils/jwt-util.js';

const authService = {
    register,
    login,
    checkForPermissions,
};

async function register(email, password) {
    let foundUser = null;

    try {
        foundUser = await findUser(email);

    } catch (err) {
        throw new Error(getErrorMessage(err));
    }

    if (foundUser) {
        throw new Error('User already exists');
    }

    try {
        return User.create({ email, password, role: ROLES.Customer });

    } catch (err) {
        throw new Error(getErrorMessage(err));
    }
}

async function login(email, password) {
    email = email.toLowerCase().trim();
    password = password.trim();

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

    const token = await asyncJWT.signAuthToken(payload);

    return {
        ...payload,
        fullName: foundUser.fullName,
        phoneNumber: foundUser.phoneNumber,
        address: foundUser.address,
        cart: foundUser.cart,
        token
    };
}

function checkForPermissions(user, authRoles) {
    if (!user) {
        throw new Error('Permission denied');
    }

    const roleId = user.role;

    if (!authRoles.includes(roleId)) {
        throw new Error('Permission denied');
    }
}

async function findUser(email) {
    return User.findOne({ email });
}

export default authService;