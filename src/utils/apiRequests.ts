import axios from "axios"
import {UserT} from "./types";
import {DictT, WordT} from "../components/Router/pages/UserPage/UserPage";
const link = process.env.REACT_APP_API_LINK

export const apiLogin = async ({username, password} : {username: string, password: string}): Promise<{jwt:string} | undefined> => {
    try {
        const response = await axios.post<{jwt:string}>(
            `${link}/auth/login`,{username: username, password: password});
        window.location.replace("/")
        return response.data
    } catch (err:any) {
        console.log("Error while getting download link: " + err)
    }
};

export const apiRegistration = async ({username, password} : {username: string, password: string}): Promise<{jwt:string} | undefined> => {
    try {
        const response = await axios.post<{jwt:string}>(
            `${link}/auth/registration`,{username: username, password: password});
        window.location.replace("/")
        return response.data
    } catch (err:any) {
        console.log("Error while getting download link: " + err)
    }
};

export const apiUser = async (): Promise<UserT | undefined> => {
        const response = await axios.get<UserT>(
            `${link}/me`,{headers:{"Authorization":localStorage.getItem("Dict_Authorization")}});
        return response.data
};

export const apiCreateDict = async (name: string, ownerId: string | number) => {
    try {
        const response = await axios.post(
            `${link}/dict`,{name:name, ownerId: ownerId},{headers:{"Authorization":localStorage.getItem("Dict_Authorization")}});
        return response.data
    } catch (err:any) {
        console.log("Error while getting download link: " + err)
    }
};

export const apiAddWords = async (words: WordT[]) => {
    try {
        const response = await axios.post(
            `${link}/dict/add/words`,{words: words},{headers:{"Authorization":localStorage.getItem("Dict_Authorization")}});
        return response.data
    } catch (err:any) {
        console.log("Error while getting download link: " + err)
    }
};


export const apiRemoveWords = async (words: WordT[]) => {
    try {
        const response = await axios.post(
            `${link}/dict/delete/words`,{words: words},{headers:{"Authorization":localStorage.getItem("Dict_Authorization")}});
        return response.data
    } catch (err:any) {
        console.log("Error while getting download link: " + err)
    }
};


export const apiGetDicts = async (): Promise<DictT[] | undefined> => {
    try {
        const response = await axios.get<DictT[]>(
            `${link}/home`,{headers:{"Authorization":localStorage.getItem("Dict_Authorization")}});
        return response.data
    } catch (err:any) {
        console.log("Error while getting download link: " + err)
    }
};

export const apiGetWords = async (): Promise<WordT[] | undefined> => {
    try {
        const response = await axios.get<WordT[]>(
            `${link}/words`,{headers:{"Authorization":localStorage.getItem("Dict_Authorization")}});
        return response.data
    } catch (err:any) {
        console.log("Error while getting download link: " + err)
    }
};

export const apiGetUserDictWords = async (): Promise<WordT[] | undefined> => {
    try {
        const response = await axios.get<WordT[]>(
            `${link}/dict/words`,{headers:{"Authorization":localStorage.getItem("Dict_Authorization")}});
        return response.data
    } catch (err:any) {
        console.log("Error while getting download link: " + err)
    }
};

export const apiSearchAllWords = async (search: string, byTranslate = false): Promise<WordT[] | undefined> => {
    try {
        const response = await axios.get<WordT[]>(
            `${link}/words/find/translate-value?starts_with=${search}&by_translate=${byTranslate}`, {headers:{"Authorization":localStorage.getItem("Dict_Authorization")}});
        return response.data
    } catch (err:any) {
        console.log("Error while getting download link: " + err)
    }
};




