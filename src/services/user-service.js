
import User from '../models/User.js';

const userService = {
    getUser,
    getCart,
    setAdditionalData
}

function getUser(user) {
    return User.findOne({ _id: user.id }, { password: 0, role: 0, cart: 0 });
}

function setAdditionalData(id, fullName, phoneNumber, address) {
    return User.findByIdAndUpdate(
        id,
        { fullName, phoneNumber, address },
        { runValidators: true }
    );
}

async function getCart(user) {
    const result = await User.findOne({ _id: user.id }, { cart: 1 });
    return result.cart;
}

export default userService;