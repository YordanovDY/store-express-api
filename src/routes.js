import { Router } from "express";
import authController from "./controllers/auth-controller.js";
import productController from "./controllers/product-controller.js";
import subcategoryController from "./controllers/subcategory-controller.js";
import userController from "./controllers/user-controller.js";

const routes = Router();

routes.use('/auth', authController);
routes.use('/user', userController);
routes.use('/subcategories', subcategoryController);
routes.use('/products', productController);

export default routes;