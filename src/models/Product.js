import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Product name is required!'],
    },

    imageUrl: {
        type: String,
        required: [true, 'Product image is required!'],
    },

    quantity: {
        type: Number,
        required: [true, 'Product quantity is required!'],
    },

    price: {
        type: Number,
        required: [true, 'Product price is required!'],
    },

    description: {
        type: String,
        required: [true, 'Product description is required!'],
    },

    characteristics: {
        type: [
            {
                _id: false,
                char: String,
                value: String
            }]
    },

    subcategory: {
        type: Types.ObjectId,
        ref: 'Subcategory'
    },

    creator: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

const Product = model('Product', productSchema);

export default Product;