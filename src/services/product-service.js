import Product from "../models/Product.js";
import { getErrorMessage } from "../utils/error-util.js";

const productService = {
    addProduct,
    getProducts,
    getSingleProduct,
    checkForAvailabilityAndCorrect
}

function getProducts() {
    return Product.find();
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

    for (let i = 0; i < cart.length; i++) {

        const productId = cart[i].product['_id'].toString();
        
        let product = null;

        try {
            product = await getSingleProduct(productId);
            
        } catch (err) {
            throw new Error('Something went wrong. Please try again!');
        }

        if(product.quantity <= 0){
            cart.splice(i, 1);

        } else if(product.quantity < cart[i].quantity){
            cart[i].quantity = product.quantity;
        }

    }

    return cart;

}

export default productService;