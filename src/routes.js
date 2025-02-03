import { Router } from "express";
import authController from "./controllers/auth-controller.js";

const routes = Router();

routes.use('/auth', authController);

export default routes;