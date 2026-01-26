import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import Button from "../components/ui/Button";
import axios, { isAxiosError } from "axios";
import { InputField } from "../components/ui/InputField";
import { useNavigate } from "react-router-dom";

interface User{
    _id: string,
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export default function UserDetails(){
    const navigate = useNavigate();
    const [message, setMessage] = useState<string|null>(null);
    const [user, setUser] = useState<User|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [change, setChange] = useState<boolean>(false);
    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/user/", {
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res)=>setUser(res.data.users)).catch((err)=>{
            console.error(err);
        })
    },[])
    useEffect(() => {
      if (!message) return;
        
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2000);
    
      return () => clearTimeout(timer);
    }, [message]);
    return(
        <div className="h-screen w-screen flex items-center flex-col gap-2 pt-6">
            <div className="w-full flex justify-end">
                <div className="relative -top-5 right-0 border text-end px-5 text-md bg-[#181716] text-white w-fit font-semibold py-2 rounded-2xl hover:bg-[#181716ad] cursor-pointer" onClick={()=>navigate("/dashboard")}> Back To Dashboard</div>
            </div>
            <h1 className="font-bold text-2xl text-center">Details</h1>
            {message&&<div className="mx-auto bg-gray-500 opacity-80 text-white text-center p-2 rounded-lg">{message}</div>}
            <div className="flex justify-center items-center flex-col gap-5 border border-gray-400 rounded-2xl px-5 py-10">
                <div className="w-15 h-15 text-2xl bg-[#181716] text-center text-white flex justify-center items-center rounded-full cursor-pointer">{localStorage.getItem("name")?.charAt(0).toUpperCase()}</div>
                <div className="font-semibold text-xl">{localStorage.getItem("name")}</div>
                <div className="flex justify-between flex-col gap-1"> 
                    <span className="text-xl font-medium">First Name: {<span className="font-normal ml-2">{user?.firstName?.toUpperCase()}</span>}</span>
                    <span className="text-xl font-medium">Last Name: <span className="font-normal ml-2">{user?.lastName?.toUpperCase()}</span></span>
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                    <div>
                        <Button onClick={()=>setChange(true)} text="Change Password" isLoading={false}></Button>
                    </div>
                    <div>
                        <Button onClick={()=>setChange(true)} text="Change First Name" isLoading={false}></Button>
                    </div>
                    <div>
                        <Button onClick={()=>setChange(true)} text="Change Last Name" isLoading={false}></Button>
                    </div>
                </div>
                {change&&<ChangeDetails setUser={setUser} loading={loading} setLoading={setLoading} setMessage={setMessage} setChange={setChange}></ChangeDetails>}
            </div>
        </div>
    )
}

interface ChangeType{
    setMessage: Dispatch<SetStateAction<string|null>>,
    setChange: Dispatch<SetStateAction<boolean>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    loading: boolean,
    setUser: Dispatch<SetStateAction<User|null>>
}
function ChangeDetails(props:ChangeType){
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    async function changeCredentials(){
        try{
            const payload: any = {};
            const firstName = firstNameRef.current?.value?.trim();
            const lastName = lastNameRef.current?.value?.trim();
            const password = passwordRef.current?.value?.trim();
            if (firstName) payload.firstName = firstName;
            if (lastName) payload.lastName = lastName;
            if (password) payload.password = password;
            if (Object.keys(payload).length === 0) {
              props.setMessage("Please enter at least one field");
              return;
            }
            props.setLoading(true);
            const response = await axios.patch("http://localhost:3000/api/v1/user", payload,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            props.setMessage(response.data.message);
            props.setLoading(false)
            axios.get("http://localhost:3000/api/v1/user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }).then(res => props.setUser(res.data.users));
            props.setChange(false);
        }
        catch(err){
            if(isAxiosError(err)){
                props.setMessage(err.response?.data?.message)
            }
            else{
                props.setMessage("Failed to update")
            }
            console.log(err);
            props.setLoading(false);
        }
    }
    return(
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between">
                <h1 className="font-medium underline text-2xl text-center">New Details</h1>
                <div className="hover:bg-red-700 rounded-2xl px-2 py-1 cursor-pointer" onClick={()=>props.setChange((prev)=>!prev)}>❌</div>
            </div>
            <InputField ref={firstNameRef} label="New First Name" placeholder="Enter first name" type="text"></InputField>
            <InputField ref={lastNameRef} label="New Last Name" placeholder="Enter last name" type="text"></InputField>
            <InputField ref={passwordRef} label="New Password" placeholder="Enter password" type="password"></InputField>
            <Button text="Submit" isLoading={props.loading} onClick={changeCredentials}></Button>
        </div>
    )
}