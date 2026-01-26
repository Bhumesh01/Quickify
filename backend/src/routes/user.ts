import { Router} from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User, Account } from "../models/db.js";
import z from "zod";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import authMiddleware from "../middleware/middleware.js";
import dotenv from "dotenv";
dotenv.config();

export const userRouter = Router();

const baseZodSchema = z.object({
    username: z.string().min(3, {message: "username must be atleast 3 characters long"}).max(30, {message: "username can't be greater than 30 characters"}),
    email: z.email({message: "please enter a valid email"}),
    password: z.string().min(8, {message: "password must be atleast 8 characters long"}).max(20, {message: "password can't be greater than 20 characters"}).refine(val=>/[A-Z]/.test(val), {message: "Password must contain at least one uppercase letter"}).refine(val => /[a-z]/.test(val), { message: "Password must contain at least one lowercase letter" }).refine(val => /[^A-Za-z0-9]/.test(val), { message: "Password must contain at least one special symbol" }).refine(val => /[0-9]/.test(val), { message: "Password must contain at least one digit" }),
    confirmedPassword: z.string().min(8, {message: "Confirmed Password must be atleast 8 characters long"}).max(20, {message: "Confirmed Password can't be greater than 20 characters"}).refine(val=>/[A-Z]/.test(val), {message: "Confirmed Password must contain at least one uppercase letter"}).refine(val => /[a-z]/.test(val), { message: "Confirmed Password must contain at least one lowercase letter" }).refine(val => /[^A-Za-z0-9]/.test(val), { message: "Confirmed Password must contain at least one special symbol" }).refine(val => /[0-9]/.test(val), { message: "Confirmed Password must contain at least one digit" }),
    firstName: z.string(),
    lastName: z.string()
});
const signupSchema = baseZodSchema.superRefine((data, ctx)=>{
    if(data.confirmedPassword!=data.password){
        ctx.addIssue({
          path: ["confirmedPassword"],
          message: "Confirmed password does not match",
          code: z.ZodIssueCode.custom
        });
    }
});
const signinSchema = baseZodSchema.omit({confirmedPassword: true, lastName: true, firstName: true});
const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  password: z
    .string()
    .min(8)
    .max(20)
    .refine(val => /[A-Z]/.test(val))
    .refine(val => /[a-z]/.test(val))
    .refine(val => /[0-9]/.test(val))
    .refine(val => /[^A-Za-z0-9]/.test(val))
    .optional(),
});

//SignUp Endpoint
userRouter.post("/signup", async (req:Request, res:Response)=>{
    try{
        const {success, data, error} = signupSchema.safeParse(req.body);
        if(!success){
            const formatted = error.flatten();
            const usernameErrors = formatted.fieldErrors.username;
            const passwordErrors = formatted.fieldErrors.password;
            const emailErrors = formatted.fieldErrors.email;
            const firstNameErrors = formatted.fieldErrors.firstName;
            const lastNameErrors = formatted.fieldErrors.lastName;
            const confirmedPasswordErrors = formatted.fieldErrors.confirmedPassword;
            return res.status(400).json({
              usernameErrors,
              passwordErrors,
              confirmedPasswordErrors,
              emailErrors,
              firstNameErrors,
              lastNameErrors
            });
        }
        const credentials:z.infer<typeof signupSchema> = data;
        const hash = await bcrypt.hash(credentials.password, 5);
        const username = credentials.username;
        const password = hash;
        const email = credentials.email;
        const firstName = credentials.firstName;
        const lastName = credentials.lastName;
        const exists = await User.findOne({
            $or: [
                {username: username},
                {email: email}
            ]
        })
        if(exists){
            return res.status(409).json({ message: "Email already taken/Incorrect inputs" });
        }
        const response = await User.create({
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
        })
        const balance = Math.floor((1 + Math.random()*10000)*100);
        await Account.create({
            userId: response._id,
            balance: balance
        })
        res.status(200).json({
            message: "Successfully signed up",
            balance: balance
        });
    }
    catch(err:any){
        return res.status(500).json({ message: err });
    }
})

//SignIn Endpoint
userRouter.post("/signin", async(req:Request, res:Response)=>{
    try{
        const {success, data, error} = signinSchema.safeParse(req.body);
        if(!success){
            const formatted = error.flatten().fieldErrors;
            return res.status(400).json(formatted);
        }
        const user = await User.findOne({$and: [{username: data.username}, {email: data.email}]});
        if(!user){
            return res.status(404).json({
                message: "User does not exists",
            });
        }
        const result = await bcrypt.compare(data.password, user.password);
        if(!result){
            return res.status(404).json({
                message: "Incorrect Password",
            });
        }
        const token = jwt.sign({userId: user._id}, `${process.env.SECRET}`);
        return res.status(200).json({
            message: "Successfully Signed In",
            token : token
        })
    }
    catch(err:any){
        console.log(err);
        return res.status(411).json({
            "message": "Error while Logging In"
        });
    }
})

userRouter.use(authMiddleware);

//Update Endpoint
interface CustomRequest extends Request {
    userId?: string;
}
userRouter.patch("/", async (req: CustomRequest, res: Response)=>{
    try{
        const {success, data, error} = updateSchema.safeParse(req.body);
        if(!success){
            const formatted = error.flatten().fieldErrors;
            return res.status(400).json({
                formatted
            });
        }
        if(!data?.password && !data?.firstName && !data?.lastName){
            return res.status(400).json({
                message: "Please enter a field to change"
            });
        }
        const userId = new mongoose.Types.ObjectId(req.userId);
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User doesn't exists"
            });
        }
        const hashedPassword =data.password?await bcrypt.hash(data.password, 5):undefined;
        const response = await User.findByIdAndUpdate(userId, {
            firstName: data.firstName,
            password: hashedPassword,
            lastName: data.lastName
        }, { new: true, omitUndefined: true });
        return res.status(200).json({
            message: "User Updated Successfully",
            response
        })
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            message: "Error While Updating User"
        })
    }
})

//Get users from the backend Endpoint
userRouter.get("/bulk", async(req:Request, res: Response)=>{
    try{
        let filterCriterion = req.query.filter as string || "";
        filterCriterion = filterCriterion&&filterCriterion.toLowerCase();
        const users = await User.find({$or: [{firstName: { $regex: '.*' + filterCriterion + '.*' }}, {lastName: { $regex: '.*' + filterCriterion + '.*' }}]}, "username firstName lastName _id").exec();
        return res.status(200).json({
            message: users.length === 0 ? "No users found" : "Users fetched successfully",
            users: users
        })
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            message: "Error Fetching users"
        })
    }
})

//Get User Details
userRouter.get("/", async(req:CustomRequest, res: Response)=>{
    try{
        const userId = req.userId;
        const user = await User.findById(userId);
        return res.status(200).json({
            message:"Users fetched successfully",
            users: user
        })
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            message: "Error Fetching user"
        })
    }
})