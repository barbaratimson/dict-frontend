
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userSlice from "./reducers/userSlice";
import {configureStore} from "@reduxjs/toolkit";
import {api} from "./api/apiSlice";

export const store = configureStore({
    reducer:{
        user: userSlice,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch