"use client"
import {createContext, useState, useEffect, useContext, Dispatch, SetStateAction} from "react";
import { useSession } from "next-auth/react";

interface AppContextProps {
    isUserSignedIn: boolean;
    setIsUserSignedId: Dispatch<SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export default function AppContextProvider({children} : {children: React.ReactNode}) {
    const [isUserSignedIn, setIsUserSignedId] = useState(false)
    const session = useSession();
    useEffect(() => {
        console.log(session);
    }, [])
    return (
        <AppContext.Provider value={{isUserSignedIn, setIsUserSignedId}}>
            {children}
        </AppContext.Provider>  
    )
}

export const useAppContext = () =>{
    const context = useContext(AppContext);
    if(!context){
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
}
