import { createContext } from "react";
import {useState , useContext } from "react"
import "./ToastContext.css";


const ToastContext = createContext({});


export const ToastProvider = ({children})=>{

    // STATES 
        const [open,setOpen] = useState(false);
        const [message,setMessage] = useState();
    // STATES 

    function showToast(msg){
        setMessage(msg);
        if(open === false){
            setOpen(true);
             setTimeout(()=>{
            setOpen(false);
        },2000)
        }
    }

    return (
        <ToastContext.Provider value ={{showToast}}>
            <div className={"toast"} style={{display: open ? "flex" : "none"}}>{message}</div>
           {children}
        </ToastContext.Provider>
    )
}


// CUSTOM HOOK
export const useToast = ()=>{
    return useContext(ToastContext);
}