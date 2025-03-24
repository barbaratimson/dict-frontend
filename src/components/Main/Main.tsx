import Sidebar from "../Sidebar/Sidebar";
import {useEffect} from "react";
import {useAppDispatch} from "../../store/store";
import {UserT} from "../../utils/types";
import {setUser, setUserDictWords} from "../../store/reducers/userSlice";
import {apiGetUserDictWords, apiUser} from "../../utils/apiRequests";
import {Router} from "../Router/Router";
import {useNavigate} from "react-router-dom";
import {WordT} from "../Router/pages/UserPage/UserPage";
import styled from "styled-components";
import {theme} from "../../styles/theme";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background: ${theme.colors.bg};
`

export const Main = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const setCurrentUser = (user: UserT) =>  dispatch(setUser(user))
    const setCurrentUserDictWords = (words: WordT[]) =>  dispatch(setUserDictWords(words))

    useEffect(() => {
        apiUser().then(data => data && setCurrentUser(data)).catch((e)=>{
            if (e.status === 401) {
                navigate("/auth/login")
            } else {
                navigate("/error")
            }
        })
        apiGetUserDictWords().then(data=> setCurrentUserDictWords(data ?? []))
    }, []);

    return (
        <AppWrapper>
            <Sidebar/>
            <Router/>
        </AppWrapper>
    );
};