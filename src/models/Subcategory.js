import { Schema, model } from "mongoose";

const subcategorySchema = new Schema({
    name:{
        type: String,
        unique: true,
        required: [true, 'Subcategory name is required!']
    }
});

const Subcategory = model('Subcategory', subcategorySchema);

export default Subcategory;