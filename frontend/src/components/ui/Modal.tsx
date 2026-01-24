import { useState, type Dispatch, type SetStateAction } from "react";
import Button from "./Button";
import { InputField } from "./InputField";

interface ModalType{
    _id: string,
    username: string;
    firstName: string;
    lastName: string;
    modal: boolean,
    setModal: Dispatch<SetStateAction<boolean>>
}

export const Modal = (props:ModalType)=>{
    const [loading, setLoading] = useState<boolean>(false);
    function toTitleCase(str:string) {
        return str
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
    return(
        <div>
            {props.modal&&<div className="absolute inset-0 z-50 bg-black/40 flex justify-center items-center px-3">
                <div className="bg-gray-50 shadow-2xl rounded-2xl w-full max-w-md p-5 sm:p-8">
                    <div onClick={()=>props.setModal((prev)=>(!prev))} className="flex justify-end items-end ml-auto relative w-full top-0 right-0">
                        <div className=" hover:bg-red-600 rounded-2xl p-2 cursor-pointer">
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
                        <Button text="Initiate Transfer" onClick={()=>{setLoading(true)}} isLoading={loading}></Button>
                    </div>
                </div>
            </div>}
        </div>
    )
}