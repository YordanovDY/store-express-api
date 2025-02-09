import Product from "../models/Product.js";

async function subtractPurchasedQuantity(purchasedItems) {
    for (const itemId in purchasedItems) {
        const product = await Product.findById(itemId);
        const newQty = product.quantity - purchasedItems[itemId];
        await Product.findByIdAndUpdate(itemId, {quantity: newQty}, { runValidators: true });
    }
}

async function restoreProductQuantity(product) {
    const productInStock = await Product.findById(product.product.toString());
    
    const newQty = productInStock.quantity + product.quantity;

    await productInStock.updateOne({ quantity: newQty }, { runValidators: true });
}

export {
    subtractPurchasedQuantity,
    restoreProductQuantity
}