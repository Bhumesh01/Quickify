import { Router } from "express";
import type { Request, Response } from "express";
import authMiddleware from "../middleware/middleware.js";
import mongoose from "mongoose";
import { Account } from "../models/db.js";
export const accountRouter = Router();

accountRouter.use(authMiddleware);

interface customRequest extends Request{
    userId?: string
}

accountRouter.get("/balance", async(req: customRequest, res: Response)=>{
    try{
        if(!req.userId){
            return res.status(400).json({
                message: "Invalid Request"
            })
        }
        const userId = new mongoose.Types.ObjectId(req.userId);
        const response = await Account.findOne({
            userId: userId
        }).populate('userId');
        if(!response){
            return res.status(400).json({
                message: "User doesn't exists"
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(400).send({
            message: "An Error Occurred! Please try again later"
        })
    }
})