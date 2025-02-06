
import User from '../models/User.js';

const userService = {
    getUser
}

async function getUser(user) {
    return User.findOne({ _id: user.id }, { password: 0, role: 0, _id: 0, cart:0 });
}

export default userService;