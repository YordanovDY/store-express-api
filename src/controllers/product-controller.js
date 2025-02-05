import { Router } from "express";
import productService from "../services/product-service.js";

const productController = Router();

productController.get('/catalog', (req, res) => {

});

productController.post('/catalog', async (req, res) => {
    const newProduct = req.body;

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

        console.error("Registration error:", err.message);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

export default productController;