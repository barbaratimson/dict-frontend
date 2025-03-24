
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userSlice from "./reducers/userSlice";
import {configureStore} from "@reduxjs/toolkit";

export const store = configureStore({
    reducer:{
        user: userSlice
    }
});

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch