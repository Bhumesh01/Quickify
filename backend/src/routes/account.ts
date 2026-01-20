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
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
        return res.json({
            message: "Successfully Fetched Balance",
            balance: formatter.format(response.balance/100)
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
        if(data.to==null || data.amount===null){
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
        const b1 = (sender.balance/100) - data.amount;
        const b2 = (sender.balance/100) - data.amount;
        const debit = await Account.findByIdAndUpdate(sender._id, {$inc: {balance: -data.amount*100}});
        const credit = await Account.findByIdAndUpdate(receiver._id, {$inc: {balance: data.amount*100}});
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