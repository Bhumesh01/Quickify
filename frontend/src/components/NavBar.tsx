import { useEffect, useState } from "react";

export default function NavBar() {
  const [name, setName] = useState("User");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setName(storedName);
  }, []);

  return (
    <div className="flex justify-between px-5 py-2 border-b border-gray-500 flex-wrap">
      <h1 className="font-bold text-3xl">Quickify</h1>

      <div className="flex gap-5 items-center text-xl">
        <h2>Hello, {name}</h2>
        <div className="h-8 w-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
