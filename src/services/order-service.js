import { getDaysInMilliseconds } from '../utils/time-in-ms.js'
import Order from '../models/Order.js';
import { getErrorMessage } from '../utils/error-util.js';
import { restoreProductQuantity } from '../utils/quantity-utils.js';

const validStatuses = ['Processing', 'Shipped', 'Delivered']

const orderService = {
    getOrders,
    getSingleOrder,
    placeAnOrder,
    changeStatus,
    cancelOrder
}

function getOrders(filter = { status: 'Processing' }) {
    if (!validStatuses.includes(filter.status)) {
        throw new Error('Invalid filter status');
    }

    try {
        return Order.find({ status: filter.status });

    } catch (err) {
        throw new Error(getErrorMessage(err));
    }
}

function getSingleOrder(orderId) {
    try {
        return Order.findById(orderId).populate('recipient', {password: 0, role: 0, cart:0});

    } catch (err) {
        throw new Error(getErrorMessage(err));
    }
}

function placeAnOrder(user, cart, paymentMethod) {
    const recipient = user.id;

    const orderedAt = new Date;

    let estimatedDelivery = new Date(orderedAt.getTime() + getDaysInMilliseconds(5));

    if (estimatedDelivery.getDay() === 6) {
        estimatedDelivery = new Date(estimatedDelivery.getTime() + getDaysInMilliseconds(2));

    } else if (estimatedDelivery.getDay() === 0) {
        estimatedDelivery = new Date(estimatedDelivery.getTime() + getDaysInMilliseconds(1));
    }
    
    let totalPrice = 0;
    for (const productData of cart) {
        totalPrice += productData.product.price * productData.quantity;
    }

    return Order.create({
        recipient,
        products: cart,
        orderedAt,
        estimatedDelivery,
        totalPrice,
        paymentMethod
    });
}

function changeStatus(orderId, status) {
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status value');
    }

    return Order.findByIdAndUpdate(orderId, { status }, { runValidators: true });
}

async function cancelOrder(order) {
    for (const product of order.products) {
        await restoreProductQuantity(product);
    }

    return Order.findByIdAndDelete(order._id);
}

export default orderService;