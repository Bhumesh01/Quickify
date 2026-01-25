import { useState, type Dispatch, type SetStateAction } from "react";
import { useRef } from "react";
import Button from "./Button";
import { InputField } from "./InputField";
import axios, { isAxiosError } from "axios";

interface ModalType{
    _id: string,
    username: string;
    firstName: string;
    lastName: string;
    modal: boolean,
    setModal: Dispatch<SetStateAction<boolean>>,
    balance: number,
    setBalance: Dispatch<SetStateAction<number>>
}

export const Modal = (props:ModalType)=>{
    const amountRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    function toTitleCase(str:string) {
        return str
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
    async function transfer(receiverId: string, setBalance: Dispatch<SetStateAction<number>>){
        try{
            const amount = amountRef.current?.value;
            if(!amount){
                setMessage("Please enter the amount to transfer");
                return;
            }
            if(!receiverId){
                setMessage("Invalid User");
                return;
            }
            setLoading(true);
            const response = await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: receiverId,
                amount: amount
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setMessage(response.data.message);
            const res = await axios.get("http://localhost:3000/api/v1/account/balance", {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            if(res.data.balance)setBalance(res.data.balance);
        }
        catch(err){
            console.log(err);
            if(isAxiosError(err)){
                setMessage(err.response?.data?.message);
            }
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <div>
            {props.modal&&<div className="absolute inset-0 z-50 bg-black/40 flex justify-center items-center px-3">
                <div className="bg-gray-50 shadow-2xl rounded-2xl w-full max-w-md p-5 sm:p-8">
                    <div onClick={()=>props.setModal((prev)=>(!prev))} className="flex justify-end items-end ml-auto relative w-full -top-5 -right-5">
                        <div className=" hover:bg-red-600 rounded-2xl p-2 cursor-pointer">
                            ❌
                        </div>
                    </div>
                    {message&&<div className="w-full font-semibold text-center bg-[#969696] text-white rounded-2xl py-2 my-1">{message}</div>}
                    <h1 className="text-3xl font-bold text-center my-2 mb-5">Send Money</h1>
                    <div className="flex gap-2 mb-5">
                        <div className="h-10 w-10 bg-[#191b1a] rounded-full text-white flex justify-center items-center font-bold">{props.firstName.charAt(0).toUpperCase()}</div>
                        <div className="text-xl flex justify-center items-center font-semibold">{toTitleCase(props.firstName)} {toTitleCase(props.lastName)}</div>
                    </div>
                    <div className="mb-5">
                        <InputField ref={amountRef} type="text" placeholder="Enter amount" label="Amount (in Rs)"></InputField>
                    </div>
                    <div className="mb-5">
                        <Button text="Initiate Transfer" onClick={()=>transfer(props._id, props.setBalance)} isLoading={loading}></Button>
                    </div>
                </div>
            </div>}
        </div>
    )
}