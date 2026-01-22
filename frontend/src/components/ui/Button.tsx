import type React from "react"

interface ButtonType{
    text: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}
export default function Button(props:ButtonType){
    return(
        <button className="bg-[#181716] text-white w-full p-2 text-xl font-semibold rounded-2xl" onClick={props.onClick}>{props.text}</button>
    )
}