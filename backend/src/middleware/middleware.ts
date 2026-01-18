import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface CustomRequest extends Request {
    userId?: string;
}

export default async function authMiddleware(req:CustomRequest, res:Response, next:NextFunction){
    const header = req.headers.authorization;
    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({
            message: "Authorization header missing or invalid"
        })
    }
    const token = header.split(' ')[1];
    if(!token){
        return res.status(401).json({
            message: "Token Not found"
        })
    }
    try{
        const decode = jwt.verify(token, `${process.env.SECRET}`) as {userId: string};
        req.userId = decode.userId;
        next();
    }
    catch(err){
        return res.status(403).json({
            message: "Unauthorized"
        })
    }
}