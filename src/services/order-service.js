import { getDaysInMilliseconds } from '../utils/time-in-ms.js'
import Order from '../models/Order.js';

const DELIVERY_PRICE = 6;

const orderService = {
    placeAnOrder
}

function placeAnOrder(user, cart) {
    const recipient = user.id;

    const orderedAt = new Date.now();

    let estimatedDelivery = new Date.now() + getDaysInMilliseconds(5);

    if (estimatedDelivery.getDay() === 6) {
        estimatedDelivery += getDaysInMilliseconds(2);

    } else if (estimatedDelivery.getDay() === 0) {
        estimatedDelivery += getDaysInMilliseconds(1);
    }

    let totalPrice = 0;
    for (const productData of cart) {
        totalPrice = productData.product.price * productData.quantity;
    }

    totalPrice + DELIVERY_PRICE;

    Order.create({
        recipient,
        products: cart,
        orderedAt,
        estimatedDelivery,
        totalPrice
    });
}

export default orderService;