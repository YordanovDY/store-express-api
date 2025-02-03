import bcrypt from 'bcrypt';
import User from "../models/User.js";
import { ROLES } from '../config/constants.js';

const authService = {
    register,
};

async function register(email, password) {
    const foundUser = await findUser(email);

    if (foundUser) {
        throw new Error('User already exists');
    }

    return User.create({ email, password, role: ROLES.Customer });
}

}

async function findUser(email) {
    return User.findOne({ email });
}

export default authService;