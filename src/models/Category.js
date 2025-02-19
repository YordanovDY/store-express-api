import { Schema, model, Types } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required!']
    },

    subcategories: [{
        type: Types.ObjectId,
        ref: 'Subcategory'
    }]
});

const Category = model('Category', categorySchema);

export default Category;