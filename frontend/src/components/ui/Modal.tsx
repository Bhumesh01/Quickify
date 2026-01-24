import { useState, type Dispatch, type SetStateAction } from "react";
import Button from "./Button";
import { InputField } from "./InputField";

interface User{
    _id: string,
    username: string;
    firstName: string;
    lastName: string;
    modal: boolean,
    setModal: Dispatch<SetStateAction<boolean>>
}

export const Modal = (props:User)=>{
    const [loading, isLoading] = useState<boolean>(false);
    function toTitleCase(str:string) {
        return str
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
    return(
        <div>
            {props.modal&&<div className="border absolute px-5 py-5 bg-gray-50 flex justify-center flex-col items-center m-auto inset-0 z-50">
                <div className="bg-red shadow-[#4d5850] shadow-2xl px-10 py-5 rounded-2xl flex justify-center items-center flex-col">
                    <div onClick={()=>props.setModal((prev)=>(!prev))} className="flex justify-end items-end ml-auto relative w-full top-0 right-0">
                        <div className=" hover:bg-red-600 rounded-2xl p-2">
                            ❌
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-center my-2 mb-5">Send Money</h1>
                    <div className="flex gap-2 mb-5">
                        <div className="h-10 w-10 bg-[#191b1a] rounded-full text-white flex justify-center items-center font-bold">{props.firstName.charAt(0).toUpperCase()}</div>
                        <div className="text-xl flex justify-center items-center font-semibold">{toTitleCase(props.firstName)} {toTitleCase(props.lastName)}</div>
                    </div>
                    <div className="mb-5">
                        <InputField type="text" placeholder="Enter amount" label="Amount (in Rs)"></InputField>
                    </div>
                    <div className="mb-5">
                        <Button text="Initiate Transfer" isLoading={loading}></Button>
                    </div>
                </div>
            </div>}
        </div>
    )
}