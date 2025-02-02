import { Router } from "express";

const authController = Router();

authController.post('/users/register', (req, res) => {
    console.log(req.body);
    res.end();
});

export default authController;