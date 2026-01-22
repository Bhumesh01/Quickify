import { Link } from "react-router-dom"
import Button from "../components/ui/Button"
import {InputField} from "../components/ui/InputField"
export default function SignIn(){
    return(
        <div className="h-screen w-screen flex flex-col justify-center">
            <div className="border flex flex-col justify-center items-center m-auto p-5 rounded-2xl gap-3 md:w-[40%]">
                <h1 className="font-bold text-4xl">Sign In</h1>
                <h2 className="text-[#5a5656] text-center font-medium text-xl wrap-break-word">Enter your credentials to access your account</h2>
                <div className="w-full">
                    <InputField label="Username" type="text" placeholder="Enter your username"></InputField>
                    <InputField label="Email" type="text" placeholder="Enter your email id"></InputField>
                    <InputField label="Password" type="text" placeholder="Enter your Password"></InputField>
                </div>
                <Button text="Sign Up"></Button>
                <p>
                    Don't' have an account?
                    <span className="underline">{<Link to="/signup"> Sign Up</Link>}</span>
                </p>
            </div>
        </div>
    )
}