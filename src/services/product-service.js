import Product from "../models/Product.js";
import { getErrorMessage } from "../utils/error-util.js";
import { subtractPurchasedQuantity } from "../utils/quantity-utils.js";

const productService = {
    addProduct,
    getProducts,
    getLatestProducts,
    getSingleProduct,
    checkForAvailabilityAndCorrect
}

function getProducts(options, page = 1, search = '') {
    page = Number(page);

    let { subcategory, limit, filter, sort } = options;

    let filters = null;

    if (search) {
        filters = {
            name: {
                $regex: search,
                $options: 'i'
            },
            quantity: { $gt: 0 }
        };

    } else {
        filters = { subcategory, quantity: { $gt: 0 } };

    }

    if (!sort) {
        sort = { price: 'asc' };
    }

    if (filter) {

        // {brand: "ASUS"}
        // {price: $lt: 1300}
        // {characteristics: {char: "RAM", value: "16 GB"}}

        const [field, value] = Object.entries(filter).at(0);

        switch (field) {
            case 'brand':
                filters[field] = value;
                break;

            case 'price':
                filters[field] = { $lt: value };
                break;

            case 'characteristics':
                const char = value.char;
                const charValue = value.value;
                filters[field] = { char, value: charValue };
                break;
        }

    }

    if (typeof page !== 'number' || page < 1) {
        page = 1;
    }

    if (typeof limit !== 'number' || limit < 1) {
        limit = 15;
    }

    const skip = (page - 1) * limit;

    return Product.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit);
}

function getLatestProducts() {
    return Product.find({}).sort({ createdAt: 'desc' }).limit(5);
}

function getSingleProduct(productId) {
    return Product.findById(productId);
}

async function addProduct(newProduct) {
    const {
        name,
        imageUrl,
        quantity,
        price,
        description,
        characteristics,
        subcategory,
        creator
    } = newProduct;

    try {
        await checkForNameDuplications(name);

    } catch (err) {
        throw new Error(err.message)
    }

    try {
        return await Product.create({
            name,
            imageUrl,
            quantity,
            price,
            description,
            characteristics,
            subcategory,
            creator
        });

    } catch (err) {
        throw new Error(getErrorMessage(err));
    }
}

async function checkForNameDuplications(productName) {
    try {
        const foundProduct = await Product.findOne({ name: productName });

        if (foundProduct) {
            throw new Error('Product name already exists!');
        }

    } catch (err) {
        throw new Error(getErrorMessage(err));
    }
}

async function checkForAvailabilityAndCorrect(cart) {
    const purchasedItems = {};

    for (let i = 0; i < cart.length; i++) {

        const productId = cart[i].product['_id'].toString();

        let product = null;

        try {
            product = await getSingleProduct(productId);

        } catch (err) {
            throw new Error('Something went wrong. Please try again!');
        }

        if (product.quantity <= 0) {
            cart.splice(i, 1);
            i--;
            continue;

        } else if (product.quantity < cart[i].quantity) {
            cart[i].quantity = product.quantity;
        }

        const itemId = productId;
        const qty = cart[i].quantity;

        purchasedItems[itemId] = qty;

    }

    try {
        await subtractPurchasedQuantity(purchasedItems);

    } catch (err) {
        const errorMsg = getErrorMessage(err)
        console.log(errorMsg);
        throw new Error('Something went wrong. Please try again!');
    }

    return cart;

}

export default productService;