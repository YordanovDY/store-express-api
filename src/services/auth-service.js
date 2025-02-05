import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { ROLES } from '../config/constants.js';
import { getErrorMessage } from '../utils/error-util.js'
import 'dotenv/config';

const { JWT_SECRET } = process.env;

const authService = {
    register,
    login,
    clearSessionData,
    verifyAuthToken,
    getUser,
    checkAuthRankII,
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
    console.log(foundUser);


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
        fullName: foundUser.fullName,
        phoneNumber: foundUser.phoneNumber,
        address: foundUser.address,
        cart: foundUser.cart,
        token
    };
}

function verifyAuthToken(authToken) {
    return jwt.verify(authToken, JWT_SECRET);
}

function checkAuthRankII(authToken) {
    const token = verifyAuthToken(authToken);
    const roleId = token.role;
    const authRoles = [ROLES.StoreManager, ROLES.Admin];

    if(!authRoles.includes(roleId)){
        throw new Error('User does not have authorization rank II');
    }
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

async function getUser(id) {
    return User.findOne({ id }, { password: 0 });
}

export default authService;