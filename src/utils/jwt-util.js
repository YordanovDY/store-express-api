import jwt from 'jsonwebtoken';
import util from 'util';
import 'dotenv/config';

const verify = util.promisify(jwt.verify);
const sign = util.promisify(jwt.sign);

const { JWT_SECRET } = process.env;

const asyncJWT = {
    verifyAuthToken,
    signAuthToken
};

function verifyAuthToken(authToken) {
    return verify(authToken, JWT_SECRET);
}

function signAuthToken(payload) {
    return sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export default asyncJWT;