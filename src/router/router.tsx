import {createBrowserRouter} from "react-router-dom";
import {Main} from "../components/Main/Main";
import {Auth} from "../components/Router/pages/Auth/Auth";

export const router = createBrowserRouter([
    {
        path: "/*",
        element: <Main/>,
    },
    {
        path: "/auth/*",
        element: <Auth/>,
    }
]);
