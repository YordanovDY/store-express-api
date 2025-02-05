import { Router } from "express";
import subcategoryService from "../services/subcategory-service.js";

const subcategoryController = Router();

subcategoryController.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        const result = await subcategoryService.addSubcategory(name);
        res.status(201).json(result);

    } catch (err) {
        res.status(400).json({message: err.message, status: 400});
    }
});

export default subcategoryController;