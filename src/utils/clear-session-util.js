import { AUTH_COOKIE_NAME } from "../config/constants.js";

function clearSessionData(req, res) {
    return new Promise((resolve, reject) => {

        req.session.destroy((err) => {

            if (err) {
                return reject(new Error('Logout failed'));
            }

            res.clearCookie(AUTH_COOKIE_NAME);
            res.clearCookie('connect.sid');

            resolve();
        });
    });
}

export default clearSessionData;