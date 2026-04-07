import "../components_css/landingPage.css";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "mx-auto flex flex-col",
        "justify-center space-y-4 text-center",
        "h-screen max-w-[95vw] md:max-w-2xl",
      )}
    >
      <h1 className="base:text-2xl text-[1.5rem] font-bold text-gray-300 sm:text-3xl">
        Welcome to the chat app
      </h1>
      <p className={cn("base:text-xl text-gray-400")}>
        Please click on the sign up button to create an account or if you
        already have an account, click on the sign in button to login
      </p>
      <div className={cn("base:mt-7 space-x-4")}>
        <button
          className={cn(
            "bg-btn-hover base:w-max after:bg-button",
            "base:px-10 base:py-3 base:text-xl",
            "relative w-20 overflow-hidden",
            "rounded-full px-3 py-2",
            "text-white after:absolute after:top-full",
            "after:left-0 after:flex after:h-full",
            "after:w-full after:items-center after:justify-center",
            "after:rounded-full after:transition-all",
            "after:content-['Sign_up'] hover:after:top-0",
          )}
          onClick={() => navigate("/register")}
        >
          Sign up
        </button>
        <button
          className={cn(
            "bg-button base:w-max after:bg-btn-hover",
            "base:px-10 base:py-3 base:text-xl",
            "relative w-20 overflow-hidden",
            "rounded-full px-3 py-2 text-white",
            "after:absolute after:top-full after:left-0",
            "after:flex after:h-full after:w-full",
            "after:items-center after:justify-center after:rounded-full",
            "after:transition-all after:content-['Sign_in'] hover:after:top-0",
          )}
          onClick={() => navigate("/login")}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
