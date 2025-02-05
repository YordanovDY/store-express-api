import Product from "../models/Product.js";
import { getErrorMessage } from "../utils/error-util.js";

const productService = {
    addProduct,
    getProducts
}

function getProducts() {
    return Product.find();
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
            creator });

    } catch (err) {
        throw new Error(getErrorMessage(err));
    }
}

async function checkForNameDuplications(productName) {
    try {
        const foundProduct = await Product.findOne({name: productName});

        if(foundProduct){
            throw new Error('Product name already exists!');
        }

    } catch (err) {
        throw new Error(getErrorMessage(err));
    }
}

export default productService;