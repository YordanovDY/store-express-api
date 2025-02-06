
import User from '../models/User.js';

const userService = {
    getUser,
    getCart
}

function getUser(user) {
    return User.findOne({ _id: user.id }, { password: 0, role: 0, cart: 0 });
}

async function getCart(user) {
    const result = await User.findOne({ _id: user.id }, { cart: 1 });
    return result.cart;
}

export default userService;