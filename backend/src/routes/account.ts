import { Router } from "express";
import type { Request, Response } from "express";
import authMiddleware from "../middleware/middleware.js";
import mongoose from "mongoose";
import { Account } from "../models/db.js";
export const accountRouter = Router();

interface TransferTypes{
    to: string,
    amount: number
}

accountRouter.use(authMiddleware);

interface CustomRequest extends Request{
    userId?: string
}

accountRouter.get("/balance", async(req: CustomRequest, res: Response)=>{
    try{
        if(!req.userId){
            return res.status(400).json({
                message: "Invalid Request"
            })
        }
        const userId = new mongoose.Types.ObjectId(req.userId);
        const response = await Account.findOne({
            userId: userId
        });
        if(!response){
            return res.status(400).json({
                message: "User doesn't exists"
            })
        }
        return res.json({
            message: "Successfully Fetched Balance",
            balance: response.balance
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            message: "An Error Occurred! Please try again later"
        })
    }
})

accountRouter.post("/transfer", async (req:CustomRequest, res: Response)=>{
    try{
        if(!req.userId){
            return res.status(400).json({
                message: "Invalid Request"
            });
        }
        const senderId = new mongoose.Types.ObjectId(req.userId);
        const data:TransferTypes = req.body;
        if(!data.to || !data.amount){
            return res.status(400).json({
                message: "Please provide the recepient and the amount"
            })
        }
        const receiverId = new mongoose.Types.ObjectId(data.to);

        const sender = await Account.findOne({userId: senderId});
        const receiver = await Account.findOne({userId: receiverId});
        if(!sender || !receiver){
            return res.status(400).json({
                message: "Invalid Account"
            })
        }
        if(sender.balance < data.amount){
            return res.status(400).json({
                message: "Insufficient Balance"
            })
        }
        const debit = await Account.findByIdAndUpdate(senderId, {$inc: {balance: sender.balance - data.amount}});
        const credit = await Account.findByIdAndUpdate(receiverId, {$inc: {balance: receiver.balance+data.amount}});
        if(!debit || !credit){
            return res.status(400).json({
                message: "Transaction failed"
            });
        }
        return res.status(200).json({
            message: "Transaction Successful"
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "An Error Occurred! Transaction Failed!"
        })
    }
})