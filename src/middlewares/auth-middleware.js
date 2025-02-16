import { AUTH_COOKIE_NAME } from "../config/constants.js"
import clearSessionData from "../utils/clear-session-util.js";
import asyncJWT from "../utils/jwt-util.js";

export const authMiddleware = () => {
    return async (req, res, next) => {
        const token = req.cookies[AUTH_COOKIE_NAME];

        if(!token){
            return next();
        }

        try {
            const userData = await asyncJWT.verifyAuthToken(token);
            req.user = userData;
            next();

        } catch (err) {
            await clearSessionData(req, res);
            res.status(401).json({ message: err.message, status: 401 });
        }
    }
}

export const requireToken = (req, res, next) =>{
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Missing authentication token', status: 401 });
    }

    next();
}