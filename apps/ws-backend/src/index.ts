import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken';
import JWT_SECRET from '@repo/config/config';
import prisma from '@repo/db/index';


const wss=new WebSocketServer({port:8080});

interface User {
    ws:WebSocket,
    rooms:string[],
    userId:string
}

const users:User[]=[];


function checkAuth(token:string):string|null{

    try { 
        const decoded=jwt.verify(token,JWT_SECRET);

    if(typeof decoded == "string"){
        return null;
    }
    
    if(!decoded || !(decoded as JwtPayload).userId){
        return null;
    }

    return decoded.userId;
}
catch(e){
    return null;
}

}

wss.on('connection',function connection(ws,request){

    const url=request.url;
    if(!url){
        return;
    }

    const QueryParams=new URLSearchParams(url.split("?")[1]);
    const token=QueryParams.get('token') || "";

    const userId=checkAuth(token);

    if(userId==null){
        ws.close();
        return null;
    }

    users.push({
        userId,
        rooms:[],
        ws:ws
    });


    ws.on('message',async function message(data){
        const parsedData=JSON.parse(data as unknown as string);

        if(parsedData.type === "join_room"){
            const user=users.find(x=>x.ws===ws);
            user?.rooms.push(parsedData.roomId)

             console.log("User joined room:", parsedData.roomId, typeof parsedData.roomId);
             console.log("Current user rooms:", user?.rooms);
        }

       

        if(parsedData.type==="leave_room"){
            const user=users.find(x=>x.ws===ws);
            if(user?.rooms)
            user.rooms=user?.rooms.filter(x=>x!==parsedData.roomId)
        }

        if(parsedData.type==="chat"){
            const roomId=parsedData.roomId;
            const message=parsedData.message;
            
            console.log("Broadcasting to room:", roomId, typeof roomId);
            console.log("Users in room:", users.filter(u => u.rooms.includes(roomId)).length);
            await prisma.chat.create({
                data:{
                    roomId:roomId,
                    message:message,
                    userId:userId
                }
            })
            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId
                    }))
                }
            })
        }
       
    })
})