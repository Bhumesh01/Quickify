interface ButtonType{
    text: string
}
export default function Button(props:ButtonType){
    return(
        <button className="bg-[#181716] text-white w-full p-2 text-xl font-semibold rounded-2xl">{props.text}</button>
    )
}