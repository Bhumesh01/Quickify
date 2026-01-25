import NavBar from "../components/NavBar";
import axios from "axios";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { InputField } from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
interface User{
    _id: string,
    username: string;
    firstName: string;
    lastName: string;
}
export default function Dashboard(){
    const [balance, setBalance] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);
    const [message, setMessage] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/account/balance", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res)=>setBalance(res.data.balance)).catch((err) => {
            console.error(err);
        });
    },[]);
    useEffect(()=>{
        setLoading(true);
        axios.get("http://localhost:3000/api/v1/user/bulk", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res)=>{
            setUsers(res.data.users);
        }).catch((err) => {
            console.log(err);
            setMessage("Error Fetching Users");
        });
        setLoading(false);
    }, []);
    return(
        <div className="flex flex-col gap-5 justify-center">
            <NavBar></NavBar>
            {message&&<div className="bg-gray-500 opacity-80 text-white text-center p-2 rounded-lg">{message}</div>}
            <div className="mx-5 text-2xl font-bold">
                <h1>Your balance is ${balance}</h1>
            </div>
            <div className="mx-5 flex justify-center flex-col gap-5">
                <InputField type="text" placeholder="Search users..." label="Users"></InputField>
                {users.map((user)=>{
                    return(
                        <Card balance={balance} setBalance={setBalance} key={user._id} username={user.username} _id={user._id} loading={loading} firstName={user.firstName} lastName={user.lastName}></Card>
                    )
                })}
            </div>
        </div>
    )
}
interface CardType extends User{
    loading: boolean,
    balance: number,
    setBalance: Dispatch<SetStateAction<number>>
}
function Card(props:CardType){
    const [openModal, setOpenModal] = useState<boolean>(false);
    async function sendMoney(){
        setOpenModal(true);
    }
    function toTitleCase(str:string) {
        return str
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
    return(
        <div className="flex w-full p-2 justify-between lp:flex-row lp:items-center flex-col gap-2">
            <div className="flex justify-start gap-5 flex-wrap">
                <div>
                    {openModal&&<Modal balance={props.balance} setBalance={props.setBalance} modal={openModal} setModal={setOpenModal} _id={props._id} firstName={props.firstName} lastName={props.lastName} username={props.username}></Modal>}
                </div>
                <div className="h-10 w-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                    {props.firstName.charAt(0).toUpperCase()}
                </div>
                <div className="text-xl font-semibold max-w-2xs">
                    <h1>{toTitleCase(props.firstName)} {toTitleCase(props.lastName)}</h1>
                </div>
            </div>
            <div className="w-auto">
                <Button onClick={sendMoney} text="Send Money" isLoading={props.loading}></Button>
            </div>
        </div>
    )
}
