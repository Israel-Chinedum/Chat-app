import "../components_css/register.css";
import { useState, useEffect } from "react";
import { useFetch } from "../customHooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../customHooks/useMessage";
import { cn } from "../lib/utils";

export const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [DOB, setDOB] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  type endPointObj = {
    url: string;
    count: number;
  };
  const [endPoint, setEndPoint] = useState<endPointObj>({ url: "", count: 0 });

  const data = {
    firstName,
    lastName,
    email,
    mobile,
    age,
    DOB,
    username,
    password,
  };

  const { response, error } = useFetch({
    method: "post",
    endPoint,
    customData: data,
  });

  const { onDisplay, setDisplay, showing, setShowing } = display(3000);

  useEffect(() => {
    error.message && setDisplay(true);
    response.message && setShowing(true);
  }, [error, response]);

  return (
    <div className="base:pb-0 bg-split-bkg pb-20">
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

      {onDisplay && (
        <p
          className="reg-msg"
          style={{ borderColor: error && "red", color: error && "red" }}
        >
          {error.message}
        </p>
      )}

      {!showing && (
        <form
          className={cn(
            "base:w-100 mx-auto mt-[10vh] flex",
            "flex-col rounded-[7px] border",
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
            className="input"
            type="text"
            placeholder="Enter First Name"
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Enter Last Name"
            required
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="input"
            type="email"
            placeholder="Enter Email Address"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Enter Mobile Number"
            required
            onChange={(e) => setMobile(e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Enter Age"
            required
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            className="input"
            type="date"
            placeholder="Enter Date of Birth"
            required
            onChange={(e) => setDOB(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Enter username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className={cn(
              "bg-button mx-auto mt-10",
              "mb-4 w-max rounded-full px-20",
              "py-3 text-xl text-white",
            )}
          >
            Submit
          </button>
        </form>
      )}

      {showing && (
        <div id="success-page-container">
          <h1>Registration Successfull</h1>
          <p>Please click on the button below in order to sign in.</p>
          <div className="buttons">
            <button onClick={() => setShowing(false)}>Back</button>
            <button onClick={() => navigate("/login")}>Sign in</button>
          </div>
        </div>
      )}
    </div>
  );
};
