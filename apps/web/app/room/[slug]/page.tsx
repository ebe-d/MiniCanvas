import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { ChatRoom } from '../../components/ChatRoom';

async function getRoomId(slug:string) {

    const roomId=await axios.get(`${BACKEND_URL}/rooms/${slug}`);
    console.log(roomId);
    return roomId.data.room.id;
}


export default async function ChatRoomInterface(
    {params}:{params:Promise<{slug:string}>}
){
    const {slug}=await params;
    const roomId=await getRoomId(slug);

    
    const typeConv=Number(roomId);
    return <ChatRoom id={typeConv}/>
}