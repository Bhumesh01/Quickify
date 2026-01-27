import { useNavigate } from "react-router-dom";

export function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="h-screen w-screen">
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
        
        {/* Brand Card */}
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-black px-10 py-8 shadow-xl">
          <h1 className="text-7xl sm:text-9xl font-extrabold tracking-wide text-white">
            QUICKIFY
          </h1>
          <p className="text-md font-medium text-neutral-400 tracking-wide">
            Pay in a blink
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-5">
          <button className="bg-black text-2xl px-6 py-2 text-white font-medium rounded-2xl hover:bg-black/75" onClick={()=>navigate("/signin")}>Sign In</button>
          <button className="bg-black text-2xl px-6 py-2 text-white font-medium rounded-2xl hover:bg-black/75" onClick={()=>navigate("/signup")}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}
