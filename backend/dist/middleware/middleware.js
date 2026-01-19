import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export default async function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "Authorization header missing or invalid"
        });
    }
    const token = header.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: "Token Not found"
        });
    }
    try {
        const decode = jwt.verify(token, `${process.env.SECRET}`);
        req.userId = decode.userId;
        next();
    }
    catch (err) {
        return res.status(403).json({
            message: "Unauthorized"
        });
    }
}
//# sourceMappingURL=middleware.js.map