import { Router } from "express";
import categoryService from "../services/category-service.js";
import { getErrorMessage } from "../utils/error-util.js";
import { requireToken } from "../middlewares/auth-middleware.js";
import { ROLES } from "../config/constants.js";
import authService from "../services/auth-service.js";

const categoryController = Router();

categoryController.get('/', async (req, res) => {
    try {
        const result = await categoryService.getCategories();
        res.json(result);

    } catch (err) {
        const errorMsg = getErrorMessage(err);
        console.error(errorMsg);

        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

categoryController.get('/:categoryId', async (req, res) => {
    const { categoryId } = req.params;

    try {
        const result = await categoryService.getSingleCategory(categoryId);

        if (!result) {
            return res.status(404).json({ message: 'Category not found', status: 404 });
        }

        res.json(result);

    } catch (err) {
        const errorMsg = getErrorMessage(err);
        console.error(errorMsg);

        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

categoryController.post('/', requireToken, async (req, res) => {
    const { name } = req.body;
    const user = req.user;
    const authRoles = [ROLES.Admin];

    try {
        authService.checkForPermissions(user, authRoles);

    } catch (err) {
        return res.status(403).json({ message: err.message, status: 403 });
    }

    try {
        await categoryService.addCategory(name);
        res.status(201).json({ message: `Category ${name} has been created`, status: 201 });

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        if (errorMsg.includes('is required')) {
            return res.status(400).json({ message: errorMsg, status: 400 });
        }

        console.error(errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

categoryController.post('/:categoryId/subcategories', requireToken, async (req, res) => {
    const { categoryId } = req.params;
    const { subcategoryId } = req.body;
    const user = req.user;
    const authRoles = [ROLES.Admin];

    try {
        authService.checkForPermissions(user, authRoles);

    } catch (err) {
        return res.status(403).json({ message: err.message, status: 403 });
    }

    try {
        await categoryService.attachSubcategory(categoryId, subcategoryId);
        res.json({ message: `Subcategory ${subcategoryId} has been attached to ${categoryId}`, status: 200 });

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        console.error(errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

export default categoryController;