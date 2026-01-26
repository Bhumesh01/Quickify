import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import axios from "axios";

interface User{
    _id: string,
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export default function UserDetails(){
    const [user, setUser] = useState<User|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/user/", {
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res)=>setUser(res.data.users)).catch((err)=>{
            console.error(err);
        })
    },[])
    return(
        <div className="h-screen w-screen flex justify-center items-center flex-col gap-5">
            <h1 className="font-bold text-2xl text-center">Details</h1>
            <div className="flex justify-center items-center flex-col gap-5 border border-gray-400 rounded-2xl px-5 py-10">
                <div className="w-15 h-15 text-2xl bg-gray-800 text-center text-white flex justify-center items-center rounded-full">{localStorage.getItem("name")?.charAt(0).toUpperCase()}</div>
                <div className="font-semibold text-xl">{localStorage.getItem("name")}</div>
                <div className="flex justify-between flex-col gap-1"> 
                    <span className="text-xl font-medium">First Name: {<span className="font-normal ml-2">{user?.firstName.toUpperCase()}</span>}</span>
                    <span className="text-xl font-medium">Last Name: <span className="font-normal ml-2">{user?.lastName.toUpperCase()}</span></span>
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                    <div>
                        <Button text="Change Password" isLoading={loading}></Button>
                    </div>
                    <div>
                        <Button text="Change First Name" isLoading={loading}></Button>
                    </div>
                    <div>
                        <Button text="Change Last Name" isLoading={loading}></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}