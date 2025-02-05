import { Schema, Types, model } from "mongoose";
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
    },

    role: {
        type: Types.ObjectId,
        ref: "Role",
        required: true
    },

    fullName: {
        type: String,
        default: ''
    },

    phoneNumber: {
        type: String,
        default: ''
    },

    address: {
        type: String,
        default: ''
    },

    // TODO: Add cart property
});

userSchema.pre('save', async function () {
    if (this.password.length < 60) {
        const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
        this.password = hash;
    }
});

const User = model('User', userSchema);

export default User;