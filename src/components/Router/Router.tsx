import UserPage from "./pages/UserPage/UserPage";
import "./Router.css"
import {Route, Routes} from "react-router-dom";
import React from "react";
import {Words} from "./pages/Words/Words";
import {Home} from "./pages/Home/Home";
import {PageContainer} from "../../styles/components";


export const Router = () => {
    return (
        <PageContainer>
            <Routes>
               <Route path="/user" element={<UserPage/>}/>
               <Route path="/words" element={<Words/>}/>
               <Route path="/" element={<Home/>}/>
            </Routes>
        </PageContainer>
    );
};