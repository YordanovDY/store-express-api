import { getDaysInMilliseconds } from '../utils/time-in-ms.js'
import Order from '../models/Order.js';

const DELIVERY_PRICE = 6;

const orderService = {
    placeAnOrder
}

function placeAnOrder(user, cart) {
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

    if (totalPrice < 100) {
        totalPrice += DELIVERY_PRICE;
    }

    return Order.create({
        recipient,
        products: cart,
        orderedAt,
        estimatedDelivery,
        totalPrice
    });
}

export default orderService;