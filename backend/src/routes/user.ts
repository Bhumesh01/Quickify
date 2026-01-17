import { Router} from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/db.js";
import z from "zod";

export const userRouter = Router();

const userZodSchema = z.object({
    username: z.string().min(3, {message: "username must be atleast 3 characters long"}).max(30, {message: "username can't be greater than 30 characters"}),
    email: z.email({message: "please enter a valid email"}),
    password: z.string().min(8, {message: "password must be atleast 8 characters long"}).max(20, {message: "password can't be greater than 20 characters"}).refine(val=>/[A-Z]/.test(val), {message: "Password must contain at least one uppercase letter"}).refine(val => /[a-z]/.test(val), { message: "Password must contain at least one lowercase letter" }).refine(val => /[^A-Za-z0-9]/.test(val), { message: "Password must contain at least one special symbol" }).refine(val => /[0-9]/.test(val), { message: "Password must contain at least one digit" }),
    firstName: z.string(),
    lastName: z.string()
});

//SignUp Endpoint
userRouter.post("/signup", async (req:Request, res:Response)=>{
    try{
        const {success, data, error} = userZodSchema.safeParse(req.body);
        if(!success){
            const formatted = error.format();
            const usernameErrors = formatted.username?._errors || [];
            const passwordErrors = formatted.password?._errors || [];
            const emailErrors = formatted.email?._errors || [];
            return res.status(400).json({
              usernameErrors,
              passwordErrors,
              emailErrors
            });
        }
        const credentials:z.infer<typeof userZodSchema> = data;
        const hash = await bcrypt.hash(credentials.password, 5);
        await User.create({
            username: credentials.username,
            password: hash
        })
        res.status(200).json({
            message: "Successfully signed up"
        });
    }
    catch(err:any){
        if (err?.code === 11000) {
        return res.status(403).json({ message: "User already exists" });
    }
        return res.status(500).json({ message: err });
    }
})