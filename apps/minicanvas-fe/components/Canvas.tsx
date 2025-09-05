import INITdraw from "@/app/draw";
import { useEffect, useRef } from "react";

export function Canvas({RoomId,socket}:{RoomId:number,socket:WebSocket}){

    const canvasRef=useRef<HTMLCanvasElement>(null);

     useEffect(()=>{

        if(canvasRef.current){
            const canvas=canvasRef.current;
            
            INITdraw(canvas,RoomId,socket);
        }
    },[canvasRef])

    return <div>
        <canvas ref={canvasRef} width={1000} height={1000}></canvas>
    </div>
}