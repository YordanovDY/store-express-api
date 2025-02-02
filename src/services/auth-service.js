import User from "../models/User.js";

const authService = {
    register
};

async function register(email, password) {
    const foundUser = await findUser(email)

    if (foundUser) {
        throw new Error('User already exists');
    }

    return User.create({ email, password });
}

async function findUser(email) {
    return await User.findOne({ email });
}

export default authService;