interface InputTypes{
    label: string,
    placeholder: string,
    type: string,
}
export default function InputField(props:InputTypes){
    return(
        <div>
            <h1 className="font-semibold text-xl mb-1">{props.label}</h1>
            <input className="w-full border rounded-md p-2" type={props.type} placeholder={props.placeholder} />
        </div>
    )
}