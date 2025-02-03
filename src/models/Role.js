import { Schema, model } from "mongoose";

const roleSchema = new Schema({
    roleName: {
        type: String,
        required: true
    }
});

const Role = model('Role', roleSchema);

export default Role;