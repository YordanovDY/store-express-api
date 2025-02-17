import { json, Router } from "express";
import productService from "../services/product-service.js";
import authService from "../services/auth-service.js";
import { ROLES } from "../config/constants.js";
import { getErrorMessage } from "../utils/error-util.js";

const productController = Router();

productController.get('/catalog', async (req, res) => {
    let { search, page } = req.query;

    const options = req.options || {};

    if (!search) {

        if (!options || !options.subcategory) {
            return res.status(400).json({ message: 'Subcategory is required', status: 400 });
        }

    }

    try {
        const result = await productService.getProducts(options, page, search);
        res.json(result);

    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

productController.get('/latest', async (req, res) => {
    const limit = req.options?.limit;

    try {
        const result = await productService.getLatestProducts(limit);
        res.json(result);

    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

productController.post('/catalog', async (req, res) => {
    const user = req.user;
    const authRoles = [ROLES.StoreManager, ROLES.Admin];

    try {
        authService.checkForPermissions(user, authRoles);

    } catch (err) {
        return res.status(403).json({ message: err.message, status: 403 });
    }

    const newProduct = req.body;
    newProduct['creator'] = user.id;

    try {
        const result = await productService.addProduct(newProduct);
        res.status(201).json(result);

    } catch (err) {
        if (err.message.includes('is required!') || err.message.includes('Cast')) {
            return res.status(400).json({ message: err.message, status: 400 });
        }

        if (err.message.includes('already exists')) {
            return res.status(409).json({ message: err.message, status: 409 });
        }

        console.error("Server error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

productController.get('/catalog/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await productService.getSingleProduct(productId);

        if (!result) {
            return res.status(404).json({ message: 'Product not found', status: 404 });
        }

        res.json(result);

    } catch (err) {
        const errorMsg = getErrorMessage(err);
        console.error(errorMsg);

        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

export default productController;