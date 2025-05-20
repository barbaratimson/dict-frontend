import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
    isActive: boolean;
    setIsActive: (a: boolean) => void;
    children: ReactNode;
}

export const Modal = ({ isActive, setIsActive, children }: ModalProps) => {
    // Create a div element for the portal only once
    useEffect(() => {
        const portalRoot = document.getElementById("portal-root");
        if (!portalRoot) {
            const element = document.createElement("div");
            element.id = "portal-root";
            document.body.appendChild(element);
        }
    }, []);


    if (!isActive) return null;

    // The modal content to be portaled
    const modalContent = (
      <>
          {isActive &&
            <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center backdrop-blur-[2px]">
                <div onClick={()=>{setIsActive(false)}} className="absolute w-full h-full bg-white/20 opacity-20 backdrop-blur-[20px]"></div>
                <div className="relative rounded-xl bg-white/20 overflow-hidden p-4 z-[1]">
                    {children}
                </div>
            </div>}
      </>
    );

    const portalRoot = document.getElementById("portal-root");

    // If portal root exists, render the portal, otherwise render null
    return portalRoot ? createPortal(modalContent, portalRoot) : null;
};