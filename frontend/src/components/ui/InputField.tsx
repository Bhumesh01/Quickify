import { forwardRef } from "react"
interface InputTypes{
    label: string,
    placeholder: string,
    type: string,
}
export const InputField = forwardRef<HTMLInputElement, InputTypes>((props, ref)=>{
    return(
        <div>
            <h1 className="font-semibold text-xl mb-1">{props.label}</h1>
            <input ref={ref} className="w-full border rounded-md p-2" type={props.type} placeholder={props.placeholder} />
        </div>
    )
})