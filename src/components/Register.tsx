import { useState, useEffect } from "react";
import { useFetch } from "../customHooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../customHooks/useMessage";
import { cn } from "../utils/cn.util";

export const Register = () => {
  const { showMessage } = useMessage();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  type endPointObj = {
    url: string;
    count: number;
  };
  const [endPoint, setEndPoint] = useState<endPointObj>({ url: "", count: 0 });

  const data = {
    email,
    username,
    password,
  };

  const { response, error } = useFetch({
    method: "post",
    endPoint,
    customData: data,
  });

  useEffect(() => {
    if (error.message) {
      showMessage({ text: error.message, status: "error" });
    } else if (response.message) {
      showMessage({ text: response.message, status: "success" });
    }
  }, [error, response]);

  return (
    <div className="base:pb-0 pb-20">
      <button
        className={cn(
          "text-dark-bkg mx-auto flex",
          "h-5 w-5 translate-y-10",
          "items-center justify-center rounded-[50%]",
          "bg-gray-500 p-5 text-xl",
          "font-bold",
        )}
        onClick={() => navigate("/")}
      >
        X
      </button>

      {!response.message && (
        <form
          className={cn(
            "base:w-100 mx-auto mt-[20vh] flex",
            "flex-col rounded-4xl border",
            "w-[95vw] border-orange-700 p-4",
          )}
          action=""
          id="reg-form"
          onSubmit={(e) => {
            e.preventDefault();
            setEndPoint({
              url: "http://localhost:2400/createUser",
              count: endPoint.count + 1,
            });
          }}
        >
          <h1 className={cn("mb-4 text-center text-2xl", "text-white")}>
            Sign up
          </h1>

          <input
            className="mb-5 rounded-full border border-orange-700 p-4 text-[18px] text-white outline-none"
            type="email"
            placeholder="Enter Email Address"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="mb-5 rounded-full border border-orange-700 p-4 text-[18px] text-white outline-none"
            type="text"
            placeholder="Enter username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="mb-5 rounded-full border border-orange-700 p-4 text-[18px] text-white outline-none"
            type="password"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className={cn(
              "bg-button mx-auto mt-5",
              "mb-4 w-max rounded-full px-20",
              "py-3 text-xl text-white",
            )}
          >
            Submit
          </button>
        </form>
      )}

      {response.message && (
        <div className={cn("mt-[30vh] mr-auto ml-auto w-max")}>
          <h1 className={cn("text-center text-3xl font-bold text-green-700")}>
            Registration Successfull
          </h1>
          <p className={cn("mt-2 text-center text-xl text-gray-400")}>
            Please click on the button below in order to sign in.
          </p>
          {/* ====== BUTTONS ====== */}
          <div className={cn("mt-4 flex justify-center gap-4")}>
            <button
              className={cn("rounded-btn1 min-w-40")}
              onClick={() => navigate("/register")}
            >
              Back
            </button>
            <button
              className={cn("rounded-btn2 min-w-40")}
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
