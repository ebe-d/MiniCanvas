"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {

  const [roomId,setroomId]=useState("");
  const router=useRouter();

  return (
    <div style={{height:"100vh",width:'100vw',background:'black', display:"flex",justifyContent:"center",alignItems:"center"}}>
    <input value={roomId} onChange={(e)=>{
      setroomId(e.target.value)
    }} type="text" placeholder="Room Id"></input>
    <button onClick={()=>{
      router.push(`/room/${roomId}`)
    }} >
      Join Room
    </button>
    </div>
  );
}
