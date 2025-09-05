import axios from 'axios'
import { HTTP_BACKEND } from '../config';


type Shape = {
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
} |
{
    type:"circle",
    centerX:number,
    centerY:number,
    radius:number
}



export default async function INITdraw(canvas:HTMLCanvasElement,roomId:number,socket:WebSocket){
            
            const ctx=canvas.getContext("2d");

            
            if(!ctx){
                return;
            }

            socket.onmessage=(event)=>{
                const message=JSON.parse(event.data);

                if(message.type=="chat"){
                    const parsedShape=JSON.parse(message.message);
                    existingShapes.push(parsedShape.shape);
                    clearCanvas(existingShapes,canvas,ctx);
                }
            }

            let existingShapes:Shape[]=await getExistingShapes(roomId);
            clearCanvas(existingShapes,canvas,ctx);


            ctx.fillStyle="black";
            ctx.fillRect(0,0,canvas.width,canvas.height);

            let clicked=false;
            let startX=0;
            let startY=0;

            canvas.addEventListener("mousedown",(e)=>{
                clicked=true;
                startX=e.clientX;
                startY=e.clientY;
            })
            canvas.addEventListener("mouseup",(e)=>{
                clicked=false;
                const width=e.clientX-startX;
                const height=e.clientY-startY;
                const shape:Shape={
                    type:"rect",
                    x:startX,
                    y:startY,
                    height,
                    width
                }
                existingShapes.push(shape);
                console.log("Sending shape:", shape, "to room:", roomId);
                socket.send(JSON.stringify({
                    type:"chat",
                    message:JSON.stringify({shape}),
                    roomId
                }))
            })
            canvas.addEventListener("mousemove",(e)=>{
                if(clicked){
                const width=e.clientX-startX;
                const height=e.clientY-startY;
               
                clearCanvas(existingShapes,canvas,ctx)
                ctx.strokeStyle="white";
                ctx.strokeRect(startX,startY,width,height);
                }
            })
}

function clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
     ctx.clearRect(0,0,canvas.width,canvas.height);
     ctx.fillStyle="black";
     ctx.fillRect(0,0,canvas.width,canvas.height);

     existingShapes.map((shape)=>{

        if(shape.type==="rect"){
            ctx.strokeStyle="white";
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        }
     })
}

async function getExistingShapes(roomId:number){
    const response=await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages=response.data.messages;

    const shapes=messages.map((x:{message:string})=>{
        const messageData=JSON.parse(x.message);
        return messageData.shape;
    });

    return shapes;

}