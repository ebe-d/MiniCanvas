import express from 'express';
import jwt from 'jsonwebtoken';
import { middleware } from './middleware';
import JWT_SECRET from '@repo/config/config';
import {CreateRoomSchema, CreateUserSchema, SignInSchema} from "@repo/common/types"
import prisma from '@repo/db/index'
import bcrypt from 'bcrypt'

const app=express();

app.use(express.json());

app.post("/signup",async (req,res)=>{

    const Parseddata=CreateUserSchema.safeParse(req.body);

    if(Parseddata.error){
        return res.status(404).json({
            message:"Error in inputs",
            error:Parseddata.error.message
        })
    }

    const hashedPass=await bcrypt.hash(Parseddata.data.password,10);
    try{
        await prisma.user.create({
            data:{
                name:Parseddata.data?.name,
                email:Parseddata.data?.email,
                password:hashedPass
            }
        })

        return res.status(200).json({
           message:'Sign up successfull'
        })
    }
    catch(e){
        return res.json({
            error:e,
        })
    }

})

app.post("/signin",async(req,res)=>{
    
    const parsedData=SignInSchema.safeParse(req.body);

    if(parsedData.error){
        return res.status(404).json({
            message:"Incorrect Inputs",
            error:parsedData.error.message
        })
    }

    try{
        const Finduser=await prisma.user.findFirst({
            where:{
                email:parsedData.data.email
            },
            select:{
                password:true,
                id:true
            }
        });
        if(!Finduser){
            return res.status(400).json({
                message:"User not found"
            })
        }
        const passCompare=await bcrypt.compare(parsedData.data.password,Finduser.password);

        if(!passCompare){
            return res.status(404).json({
                error:"Incorrect password"
            })
        }
        const UserId=Finduser.id;

        const token=jwt.sign({
            userId:UserId
        },JWT_SECRET)

        return res.status(200).json({
            token:token
        })
    }
    catch(e){
    console.error("Signin error:", e); // <--- add this
    return res.status(500).json({
        message:'Internal Server Error',
        error:e
    })
}

});

app.post("/room",middleware,async(req,res)=>{

    const parsedData=CreateRoomSchema.safeParse(req.body);

    if(parsedData.error){
        return res.status(403).json({
            error:parsedData.error.message
        })
    }

    //@ts-ignore
    const userId=req.userId;

    try{
        const room=await prisma.room.create({
        data:{
            slug:parsedData.data?.Roomname,
            adminId:userId
        },
        select:{
            id:true
        }
    })
        return res.status(200).json({
            message:"Room created",
            id:room.id
        })
    }
    catch(e){
        return res.status(503).json({
            message:"Internal Sever Error",
            error:e
        })
    }
})

app.get("/chats/:roomId",async(req,res)=>{
    const roomId=Number(req.params.roomId);
    const messages=await prisma.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy:{
            id:'desc'
        },
        take:50
    });
    res.json({
        messages
    })
});

app.get("/rooms/:slug",async(req,res)=>{
    const slug=req.params.slug;

    const room=await prisma.room.findFirst({
        where:{
            slug:slug
        }
    });

    res.json({
        room
    })
})

app.listen(3001,()=>{
    console.log("Hi there at 3001");
})