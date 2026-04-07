import "../components_css/login.css";
import { useState, useEffect } from "react";
import { useFetch } from "../customHooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../customHooks/useMessage";
import { cn } from "../lib/utils";

export const Login = () => {
  const navigate = useNavigate();

  type endPointObj = {
    url: string;
    count: number;
  };

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [endPoint, setEndPoint] = useState<endPointObj>({ url: "", count: 0 });

  const { showMessage, setStatus } = useMessage();

  const { response, error } = useFetch({
    method: "post",
    endPoint: endPoint,
    customData: { username, password },
  });

  useEffect(() => {
    if (error.message) {
      setStatus("error");
      showMessage({ text: error.message, duration: 3000 });
    }
    response.message && navigate("/home");
  }, [error, response]);

  return (
    <>
      <button
        className={cn(
          "text-dark-bkg mx-auto flex",
          "h-5 w-5 translate-y-20",
          "items-center justify-center rounded-[50%]",
          "p-5 text-xl font-bold",
          "bg-gray-500",
        )}
        onClick={() => navigate("/")}
      >
        X
      </button>
      <form
        className={cn(
          "mx-auto mt-[50vh] flex",
          "translate-y-[-50%] flex-col md:w-xl",
          "items-center justify-center space-y-10 p-4",
        )}
        action=""
        id="form"
        onSubmit={(e) => {
          e.preventDefault();
          setEndPoint({
            url: "http://localhost:2400/login",
            count: endPoint.count + 1,
          });
        }}
      >
        <h1 className={cn("text-3xl font-bold text-white")}>Sign in</h1>
        <div className="space-y-4">
          <input
            className={cn(
              "border-orange-700 outline-0",
              "w-full rounded-full border-2",
              "p-2 text-center text-lg text-white",
            )}
            type="text"
            name="username"
            value={username}
            placeholder="Enter username"
            required
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            className={cn(
              "border-orange-700 outline-0",
              "w-full rounded-full border-2",
              "p-2 text-center text-lg text-white",
            )}
            type="password"
            name="password"
            value={password}
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          id="login-btn"
          className={cn(
            "bg-button rounded-full px-12 py-2",
            "text-xl text-white",
          )}
        >
          Login
        </button>
      </form>
    </>
  );
};
