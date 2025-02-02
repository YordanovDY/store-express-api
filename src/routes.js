import { Router } from "express";
import authController from "./controllers/auth-controller.js";

const routes = Router();

routes.use(authController);

export default routes;