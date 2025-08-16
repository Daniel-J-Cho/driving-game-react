import jwt from 'jsonwebtoken';
import { ClientError } from "./client-error.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new ClientError(401, 'Authorization token missing.');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        throw new ClientError(401, 'Invalid token.');
    }
};

export default authMiddleware;
