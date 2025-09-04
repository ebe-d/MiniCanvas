
import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket(){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>();

    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZGEyOWJmYS1jMWZmLTQ0M2EtOThjMC1kNDdiYWIxNGViZWMiLCJpYXQiOjE3NTY5MzY0OTZ9.cLXN02uvUQ_9eZQBLbFOcBhJmZc_4n8r26UkuMvAYik`);
        ws.onopen=()=>{
            setLoading(false);
            setSocket(ws);
        }

    },[]);

    return {
        socket,
        loading
    }
}