import {createSlice, current, PayloadAction} from "@reduxjs/toolkit"
import {UserT} from "../../utils/types";
import {userInitState} from "../initialStates";
import {WordT} from "../../components/Router/pages/UserPage/UserPage";

interface userState {
    user: UserT
    dictWords: WordT[]
}

const initialState:userState = {
    user: userInitState,
    dictWords: []
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        setUser(state, action:PayloadAction<UserT>) {
            state.user = action.payload
        },
        setUserDictWords(state, action:PayloadAction<WordT[]>) {
            state.dictWords = action.payload
        },
    }
})


export const { setUser, setUserDictWords } = userSlice.actions
export default userSlice.reducer