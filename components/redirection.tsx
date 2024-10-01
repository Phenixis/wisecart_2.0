"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Redirection({ destination='/', message="You don't have access to this ressource, you'll be redirected to the homepage. Redirecting..."}){
    
    useEffect(() => {
        setTimeout(() => {
            redirect(destination);
        }, 3000);
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-2xl font-semibold">{message}</p>
        </div>
    )
}