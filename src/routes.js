import { Router } from "express";
import authController from "./controllers/auth-controller.js";
import subcategoryController from "./controllers/subcategory-controller.js";

const routes = Router();

routes.use('/auth', authController);
routes.use('/subcategories', subcategoryController);

export default routes;