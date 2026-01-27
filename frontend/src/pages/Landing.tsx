import Button from "../components/ui/Button";

export function LandingPage() {
  return (
    <div className="h-screen w-screen bg-neutral-900">
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
        
        {/* Brand Card */}
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-black px-10 py-8 shadow-xl">
          <h1 className="text-7xl sm:text-9xl font-extrabold tracking-wide text-white">
            QUICKIFY
          </h1>
          <p className="text-sm text-neutral-400 tracking-wide">
            Pay in a blink
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-5">
          <Button text="Sign Up" isLoading={false} />
          <Button text="Log In" isLoading={false} />
        </div>
      </div>
    </div>
  );
}
