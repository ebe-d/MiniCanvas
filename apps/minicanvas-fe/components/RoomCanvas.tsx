"use client";


import { WS_URL } from "@/app/config";
import INITdraw from "@/app/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId:number}){

    
    const [socket,setSocket]=useState<WebSocket | null>(null);

    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YTNmYmUxMy02MjQxLTQ4MjItODlmOC01MTY0OGYxMmFhZTEiLCJpYXQiOjE3NTcwNzU1NTB9.sxs69kwV72urDfLcryT6NGLmrqXSQiIH2AkBx6nBpw0`);

        ws.onopen=()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        }

    },[])

    if(!socket){
        return <div>
            Connecting to Server
        </div>
    }

    return <div>
        <Canvas socket={socket} RoomId={roomId}></Canvas>
    </div>
}