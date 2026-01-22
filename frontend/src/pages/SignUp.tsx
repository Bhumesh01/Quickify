import { Link } from "react-router-dom"
import Button from "../components/ui/Button"
import {InputField} from "../components/ui/InputField"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
export default function SignUp(){
    const [message, setMessage] =useState<string|null>(null);
    const userNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const firstRef = useRef<HTMLInputElement>(null);
    const lastRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const cnfPassRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    async function submit(){
        const username = userNameRef.current?.value;
        const email = emailRef.current?.value;
        const firstName = firstRef.current?.value;
        const lastName = lastRef.current?.value;
        const password = passwordRef.current?.value;
        const confirmPassword = cnfPassRef.current?.value;
        if(!username || !password || !email || !firstName || !lastName || !confirmPassword){
            setMessage("All Fields are Required!");
            return;
        }
        try{
            const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
                username: username,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName,
                confirmedPassword: confirmPassword
            });
            setMessage(response.data.message);
            if(response.status === 200){
                navigate("/signin");
            }
        }
        catch(err){
            setMessage("Error encountered" +  err);
        }
    }
    return(
        <div className="h-screen w-screen flex flex-col justify-center">
            <div className="border flex flex-col justify-center items-center m-auto p-5 rounded-2xl gap-3">
                {message&&(
                    <div className="bg-[#535558] absolute md:top-20 top-10 opacity-80 text-white text-xl font-semibold p-2 rounded-2xl">{message}</div>
                )}
                <h1 className="font-bold text-4xl">Sign Up</h1>
                <h2 className="text-[#5a5656] text-center font-medium text-xl wrap-break-word">Enter your information to create an account</h2>
                <div className="w-full">
                    <InputField ref={userNameRef} label="Username" type="text" placeholder="Enter your username"></InputField>
                    <InputField ref={emailRef} label="Email" type="text" placeholder="Enter your email id"></InputField>
                    <InputField ref={firstRef} label="First Name" type="text" placeholder="Enter your  first name"></InputField>
                    <InputField ref={lastRef} label="Last Name" type="text" placeholder="Enter your last name"></InputField>
                    <InputField ref={passwordRef} label="Password" type="text" placeholder="Enter your Password"></InputField>
                    <InputField ref={cnfPassRef} label="Confirm Password" type="text" placeholder="Enter your confirm password"></InputField>
                </div>
                <Button text="Sign Up" onClick={submit}></Button>
                <p>
                    Already have an account?
                    <span className="underline">{<Link to="/signin"> Login</Link>}</span>
                </p>
            </div>
        </div>
    )
}