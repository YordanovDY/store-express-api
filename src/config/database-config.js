import mongoose from "mongoose";
import 'dotenv/config';

const { DATABASE_URI } = process.env;

export default async function databaseInit() {
    try {
        await mongoose.connect(DATABASE_URI);
        console.log('DB Connected Successfully.');

    } catch (err) {
        console.error('Cannot connect to DB:\n' + err.message);
    }
}