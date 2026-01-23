import { Link } from "react-router-dom"
import Button from "../components/ui/Button"
import {InputField} from "../components/ui/InputField"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
interface SignUpError{
    usernameErrors: string[],
    passwordErrors: string[],
    confirmedPasswordErrors: string[],
    emailErrors: string[],
    firstNameErrors: string[],
    lastNameErrors: string[],
}
export default function SignUp(){
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] =useState<string|null>(null);
    const [error, setErrors] =useState<SignUpError|null>(null);
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
        const isAlpha = /^[A-Za-z]+$/;
        if(!isAlpha.test(firstName) || !isAlpha.test(lastName)){
            setMessage("first and last name must be a valid string");
            return;
        }
        setLoading(true);
        setErrors(null);
        setMessage("");
        try{
            const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
                username: username,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName,
                confirmedPassword: confirmPassword
            });
            setTimeout(()=>{
                setMessage("");
                setLoading(false);
                setMessage(response.data.message);
                navigate("/signin");
            }, 1000);
        }
        catch(err){
            if(axios.isAxiosError(err)){
                console.error(err.response?.data)
                setMessage(err.response?.data?.message);
                setErrors(err.response?.data);
            }
            else{
                setMessage("Error Signing Up");
                setLoading(false);
                console.error(err)
            }
            setLoading(false);
        }
    }
    return(
        <div className="border-3 pt-5 pb-5 min-h-screen w-screen flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-md border rounded-2xl p-6 flex flex-col gap-4">
                {message&&(
                    <div className="bg-gray-500 opacity-80 text-white text-center p-2 rounded-lg">{message}</div>
                )}
                <h1 className="text-3xl font-bold text-center">Sign Up</h1>
                <h2 className="text-gray-700 text-center font-medium text-xl">Enter your information to create an account</h2>
                <div className="w-full">
                    <InputField ref={userNameRef} label="Username" type="text" placeholder="Enter your username" errorMessage={error?.usernameErrors?.join(",")}></InputField>
                    <InputField ref={emailRef} label="Email" type="text" placeholder="Enter your email id" errorMessage={error?.emailErrors?.join(",")}></InputField>
                    <InputField ref={firstRef} label="First Name" type="text" placeholder="Enter your  first name" errorMessage={error?.firstNameErrors?.join(",")}></InputField>
                    <InputField ref={lastRef} label="Last Name" type="text" placeholder="Enter your last name" errorMessage={error?.lastNameErrors?.join(",")}></InputField>
                    <InputField ref={passwordRef} label="Password" type="password" placeholder="Enter your Password" errorMessage={error?.passwordErrors?.join(",")}></InputField>
                    <InputField ref={cnfPassRef} label="Confirm Password" type="password" placeholder="Enter your confirm password" errorMessage={error?.confirmedPasswordErrors?.join(",")}></InputField>
                </div>
                <Button isLoading={loading} text="Sign Up" onClick={submit}></Button>
                <p className="text-center">
                    Already have an account?
                    <span className="underline">{<Link to="/signin"> Login</Link>}</span>
                </p>
            </div>
        </div>
    )
}