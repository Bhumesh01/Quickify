import { Link } from "react-router-dom"
import Button from "../components/ui/Button"
import InputField from "../components/ui/InputField"
export default function SignUp(){
    return(
        <div className="h-screen w-screen flex flex-col justify-center">
            <div className="border flex flex-col justify-center items-center m-auto p-5 rounded-2xl gap-3 md:w-[43%]">
                <h1 className="font-bold text-4xl">Sign Up</h1>
                <h2 className="text-[#5a5656] text-center font-medium text-xl wrap-break-word">Enter your information to create an account</h2>
                <div className="w-full">
                    <InputField label="Username" type="text" placeholder="Enter your username"></InputField>
                    <InputField label="Email" type="text" placeholder="Enter your email id"></InputField>
                    <InputField label="First Name" type="text" placeholder="Enter your  first name"></InputField>
                    <InputField label="Last Name" type="text" placeholder="Enter your last name"></InputField>
                    <InputField label="Password" type="text" placeholder="Enter your Password"></InputField>
                    <InputField label="Confirm Password" type="text" placeholder="Enter your confirm password"></InputField>
                </div>
                <Button text="Sign Up"></Button>
                <p>
                    Already have an account?
                    <span className="underline">{<Link to="/signin"> Login</Link>}</span>
                </p>
            </div>
        </div>
    )
}