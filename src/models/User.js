import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from "../config/constants.js";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function () {
    if (this.password.length < 60) {
        const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
        this.password = hash;
    }
});

const User = model('User', userSchema);

export default User;