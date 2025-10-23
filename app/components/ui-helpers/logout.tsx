"use client"
import {LogOutIcon} from "lucide-react";
import {signOut} from "next-auth/react"
export default function LogOutBtn(){
    function handleLogout(){
        signOut();
    }
    return (
        <button onClick={() => handleLogout()} className="flex items-center gap-2 text-red-500 scale-95 hover:scale-100 text-sm hover:font-medium cursor-pointer duration-300 ease-in-out">
            <LogOutIcon className="w-4 h-4"/>
            <span>Log Out</span>
        </button>
    )
}