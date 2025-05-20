import { useLocation, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { apiLogin, apiRegistration } from "../../../../utils/apiRequests";
import { Input } from "../../../Input/Input";

interface Inputs {
  username: string;
  password: string;
}

export const Auth = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterForm = location.pathname === "/auth/register";
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (isRegisterForm) {
      apiRegistration(data).then((data) =>
        localStorage.setItem("Dict_Authorization", "Bearer " + data?.jwt),
      );
    } else {
      apiLogin(data).then((data) =>
        localStorage.setItem("Dict_Authorization", "Bearer " + data?.jwt),
      );
    }
  };

  return (
    <div className="bg-background-900 flex h-[100vh] flex-col items-center justify-center gap-4 bg-black p-4 text-white">
      <form
        className="flex w-fit flex-col items-center justify-center gap-4 rounded-xl bg-white/20 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>{isRegisterForm ? "Register" : "Login"}</div>
        <Input
          label="Username"
          {...register("username", { required: true, maxLength: 10 })}
          placeholder="Username"
        ></Input>
        <Input
          label="Password"
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
        ></Input>
        <button className="bg-primary-500 w-full p-2 rounded-xl" type="submit">
          {isRegisterForm ? "Register" : "Login"}
        </button>
        {isRegisterForm ? (
          <div
            className="text-blue-400 text-small cursor-pointer"
            onClick={() => {
              navigate("/auth/login");
            }}
          >
            Have an account? Login
          </div>
        ) : (
          <div
            className="text-blue-400 text-small cursor-pointer"
            onClick={() => {
              navigate("/auth/register");
            }}
          >
            Don`t have account? Register
          </div>
        )}
      </form>
    </div>
  );
};
