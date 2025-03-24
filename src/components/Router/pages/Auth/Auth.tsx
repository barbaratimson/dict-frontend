import "./Auth.css";
import {useLocation} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import {apiLogin, apiRegistration} from "../../../../utils/apiRequests";
import styled from "styled-components";
import {theme} from "../../../../styles/theme";
import {Input, TextLarge} from "../../../../styles/components";

interface Inputs {
    username: string
    password: string
}

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 16px;
  background: ${theme.colors.primary};
`

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: ${theme.colors.bg};
`

export const Auth = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>()

    const location = useLocation();
    const isRegisterForm = location.pathname === "/auth/register"
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (isRegisterForm) {
            apiRegistration(data).then(data => localStorage.setItem("Dict_Authorization", ("Bearer " + data?.jwt) ?? ""))
        } else {
            apiLogin(data).then(data => localStorage.setItem("Dict_Authorization", ("Bearer " + data?.jwt) ?? ""))
        }
    }

    return (
        <AuthContainer>
            <AuthForm className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                <TextLarge>{isRegisterForm ? "Register" : "Login"}</TextLarge>
                <Input {...register("username", {required: true, maxLength: 10})} placeholder="Username"></Input>
                <Input {...register("password", {required: true})} type="password" placeholder="Password"></Input>
                <button type="submit">{isRegisterForm ? "Register" : "Login"}</button>
            </AuthForm>
        </AuthContainer>
    );
};