import { Link, useNavigate } from "react-router-dom"
import Button from "../components/ui/Button"
import {InputField} from "../components/ui/InputField"
import { useRef, useState } from "react"
import axios, { isAxiosError } from "axios"
interface ErrorMessageType{
    email: string[],
    password: string[],
    username: string[]
}
export default function SignIn(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string|null>(null);
    const [errorMessage, setErrorMessage] = useState<ErrorMessageType|null>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    async function submit(){
        setLoading(true);
        setErrorMessage(null);
        setMessage(null);
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const email = emailRef.current?.value;
        if(!username || !email || !password){
            setMessage("All fields are required");
            setLoading(false);
            return;
        }
        try{
            const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                username: username,
                password: password,
                email:email
            });
            setMessage(response.data.message);
            localStorage.setItem("token", response.data.token);
            setTimeout(()=>{
                setMessage("");
                setLoading(false);
                navigate("/dashboard");
            }, 1000);
        }
        catch(err){
            if(isAxiosError(err)){
                console.log(err.response)
                setErrorMessage(err.response?.data)
                setMessage(err.response?.data.message)
            }
            else{
                setMessage("Error while signing in")
            }
            setLoading(false)
        }
    }
    return(
        <div className="border-3 pt-5 pb-5 min-h-screen w-screen flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-md border rounded-2xl p-6 flex flex-col gap-4">
                {message&&(
                    <div className="bg-gray-500 opacity-80 text-white text-center p-2 rounded-lg w-full">{message}</div>
                )}
                <h1 className="font-bold text-4xl text-center">Sign In</h1>
                <h2 className="text-[#5a5656] text-center font-medium text-xl wrap-break-word">Enter your credentials to access your account</h2>
                <div className="w-full">
                    <InputField errorMessage={errorMessage?.username?.join(',')}  ref={usernameRef} label="Username" type="text" placeholder="Enter your username"></InputField>
                    <InputField errorMessage={errorMessage?.email?.join(",")} ref={emailRef} label="Email" type="text" placeholder="Enter your email id"></InputField>
                    <InputField errorMessage={errorMessage?.password?.join(",")} ref={passwordRef} label="Password" type="password" placeholder="Enter your Password"></InputField>
                </div>
                <Button isLoading={loading} onClick={submit} text="Sign In"></Button>
                <p className="text-center flex justify-center gap-1">
                    Don't' have an account? 
                    <span className="underline">{<Link to="/signup">Sign Up</Link>}</span>
                </p>
            </div>
        </div>
    )
}