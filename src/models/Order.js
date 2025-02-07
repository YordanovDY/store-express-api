import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema({
    status: {
        type: String,
        default: 'Processing',
        enum: ['Processing', 'Shipped', 'Delivered']
    },

    orderedAt: {
        type: Number,
        required: [true, 'Date and time of order is required!']
    },

    estimatedDelivery: {
        type: Number,
        required: [true, 'Estimated delivery date is required!']
    },

    totalPrice: {
        type: Number,
        required: [true, 'Total price is required!']
    },

    products: {
        type: [{
            _id: false,
            quantity: {
                type: Number,
                required: [true, 'Product quantity is required!'],
                min: [1, 'Product quantity must be a positive number!']
            },
            product: {
                type: Types.ObjectId,
                ref: 'Product',
                required: [true, 'Product is required!']
            }
        }]
    },

    supplier: {
        type: Types.ObjectId,
        ref: 'Supplier',
    },

    recipient: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient is required!']
    }
});

const Order = model('Order', orderSchema);

export default Order;