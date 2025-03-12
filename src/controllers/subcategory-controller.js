import { json, Router } from "express";
import subcategoryService from "../services/subcategory-service.js";
import { requireToken } from "../middlewares/auth-middleware.js";
import { ROLES } from "../config/constants.js";
import authService from "../services/auth-service.js";
import { getErrorMessage } from "../utils/error-util.js";

const subcategoryController = Router();

subcategoryController.get('/:subcategoryId', async (req, res) => {
    const { subcategoryId } = req.params;

    try {
        const result = await subcategoryService.getSingleSubcategory(subcategoryId);

        if (!result) {
            return res.status(404).json({ message: 'Subcategory not found', status: 404 });
        }

        res.json(result);

    } catch (err) {
        const errorMsg = getErrorMessage(err);
        console.error(errorMsg);
        
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

subcategoryController.post('/', requireToken, async (req, res) => {
    const { name } = req.body;

    const user = req.user;
    const authRoles = [ROLES.Admin];

    try {
        authService.checkForPermissions(user, authRoles);

    } catch (err) {
        return res.status(403).json({ message: err.message, status: 403 });
    }

    try {
        await subcategoryService.addSubcategory(name);
        res.status(201).json({ message: `Subcategory ${name} has been created`, status: 201 });

    } catch (err) {
        const errorMsg = getErrorMessage(err);

        if (errorMsg.includes('is required')) {
            return res.status(400).json({ message: errorMsg, status: 400 });
        }

        if (errorMsg.includes('already exists')) {
            return res.status(409).json({ message: errorMsg, status: 409 });
        }

        console.error(errorMsg);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
});

export default subcategoryController;