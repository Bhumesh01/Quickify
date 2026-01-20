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
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
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
        if (data.to === req.userId) {
            return res.status(400).json({ message: "Cannot transfer to self" });
        }
        const receiverId = new mongoose.Types.ObjectId(data.to);

        const sender = await Account.findOne({userId: senderId}).session(session);
        const receiver = await Account.findOne({userId: receiverId}).session(session);
        if(!sender || !receiver){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid Account"
            })
        }
        if (data.amount <= 0 || !Number.isInteger(data.amount * 100)) {
            return res.status(400).json({ message: "Invalid amount" });
        }
        const amountPaise = data.amount*100;
        const debit = await Account.updateOne({_id: sender._id, balance: { $gte: amountPaise }}, {$inc: {balance: -amountPaise}}).session(session);
        if(debit.modifiedCount !== 1){
            await session.abortTransaction();
            return res.status(400).json({
              message: "Insufficient Balance"
            });
        }
        const credit = await Account.updateOne({_id: receiver._id}, {$inc: {balance: amountPaise}}).session(session);
        if(credit.modifiedCount !== 1){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Transaction failed"
            });
        }
        await session.commitTransaction();
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
    finally{
        session.endSession();
    }
})