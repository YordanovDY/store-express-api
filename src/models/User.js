import { Schema, Types, model } from "mongoose";
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from "../config/constants.js";

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required!'],
        match: [/^[a-zA-z]+[a-zA-Z0-9\.]*[a-zA-z0-9]+@[a-zA-z]{2,}\.[a-zA-z]{2,}$/, 'Invalid email address!'],
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, 'Password is required!'],
        minLength: [6, 'Password must be in range 6 to 24 characters!'],
        trim: true
    },

    role: {
        type: Types.ObjectId,
        ref: "Role",
        required: true,
        trim: true
    },

    fullName: {
        type: String,
        default: '',
        match: [/^[a-zA-z -]+$/, 'Invalid name format!'],
        trim: true
    },

    phoneNumber: {
        type: String,
        default: '',
        match: [/^[0-9]{8,12}$/, 'Invalid phone format'],
        trim: true
    },

    address: {
        type: String,
        default: '',
        trim: true
    },

    cart: {
        type: [{
            _id: false,
            quantity: Number,
            product: {
                type: Types.ObjectId,
                ref: 'Product'
            }
        }],
        default: []
    },

});

userSchema.pre('save', async function () {
    if (this.password.length < 60) {
        const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
        this.password = hash;
    }
});

const User = model('User', userSchema);

export default User;