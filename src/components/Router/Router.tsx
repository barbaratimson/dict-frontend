import { Route, Routes } from "react-router-dom";
import React from "react";
import { Words } from "./pages/Words/Words";
import { Home } from "./pages/Home/Home";
import { Dictionary } from "../Dictionary/Dictionary";
import Quizlet from "../Quizlet/Quizlet";
export const Router = () => {
  return (
    <div className="left bg-background-950 flex h-[100vh] w-[100vw] flex-col p-4">
      <Routes>
        <Route path="/dictionary/:dictionaryId" element={<Dictionary />} />
        {/*<Route path="/words" element={<Words />} />*/}
        <Route path="/quizlet" element={<Quizlet />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};
