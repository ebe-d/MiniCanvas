"use client";


import { WS_URL } from "@/app/config";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId, onConnectionChange}:{roomId:number, onConnectionChange?: (connected: boolean) => void}){

    
    const [socket,setSocket]=useState<WebSocket | null>(null);

    useEffect(()=>{
        // Notify parent that we're connecting
        onConnectionChange?.(false);

        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YTNmYmUxMy02MjQxLTQ4MjItODlmOC01MTY0OGYxMmFhZTEiLCJpYXQiOjE3NTcwNzU1NTB9.sxs69kwV72urDfLcryT6NGLmrqXSQiIH2AkBx6nBpw0`);

        ws.onopen=()=>{
            setSocket(ws);
            // Notify parent that we're connected
            onConnectionChange?.(true);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        }

        ws.onclose = () => {
            // Notify parent that we're disconnected
            onConnectionChange?.(false);
        }

    },[roomId, onConnectionChange])

    if(!socket){
        return <div>
            Connecting to Server
        </div>
    }

    return <Canvas socket={socket} RoomId={roomId}></Canvas>
}