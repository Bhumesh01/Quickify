import type React from "react"

interface ButtonType{
    text: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    isLoading: boolean
}
export default function Button(props:ButtonType){
    return(
        <button disabled={props.isLoading} className="bg-[#181716] text-white w-full p-2 text-xl font-semibold rounded-2xl hover:bg-[#181716ad] active:bg-[#181716ad] disabled:bg-[#181716ad] disabled:cursor-not-allowed" onClick={props.onClick}>{props.isLoading?(<div className="flex items-center justify-center gap-2">
            <div>Loading</div>
            <span className="h-5 w-5 border-white border-2 rounded-full text-white animate-spin border-t-transparent"></span>
        </div>):(props.text)}</button>
    )
}