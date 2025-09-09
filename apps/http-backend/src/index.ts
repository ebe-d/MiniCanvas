import express from 'express';
import jwt from 'jsonwebtoken';
import { middleware } from './middleware';
import JWT_SECRET from '@repo/config/config';
import {CreateRoomSchema, CreateUserSchema, SignInSchema} from "@repo/common/types"
import prisma from '@repo/db/index'
import bcrypt from 'bcrypt'
import cors from 'cors';

const app=express();

app.use(express.json());
app.use(cors({}));

app.post("/signup",async (req,res)=>{

    const Parseddata=CreateUserSchema.safeParse(req.body);

    if(Parseddata.error){
        return res.status(400).json({
            message: "Please provide valid information for all fields"
        });
    }

    const hashedPass=await bcrypt.hash(Parseddata.data.password,10);
    try{
        const user = await prisma.user.create({
            data:{
                name:Parseddata.data?.name,
                email:Parseddata.data?.email,
                password:hashedPass
            }
        })

        const token=jwt.sign({
            userId:user.id
        },JWT_SECRET)

        return res.status(200).json({
           message:'Sign up successfull',
           token:token
        })
    }
    catch(e: any){
        console.error('Signup error:', e);

        // Handle specific database errors
        if (e.code === 'P2002') {
            return res.status(400).json({
                message: 'An account with this email already exists'
            });
        }

        return res.status(500).json({
            message: 'Unable to create account. Please try again.'
        });
    }

})

app.get("/me", middleware, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId;

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user: user
        });
    } catch (e) {
        console.error("Error fetching user:", e);
        return res.status(500).json({
            message: "Internal Server Error",
            error: e
        });
    }
});

app.post("/signin",async(req,res)=>{
    
    const parsedData=SignInSchema.safeParse(req.body);

    if(parsedData.error){
        return res.status(400).json({
            message: "Please provide a valid email and password"
        });
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
    catch(e: any){
    console.error("Signin error:", e);
    return res.status(500).json({
        message: 'Unable to sign in. Please try again.'
    });
    }
});

app.post("/room",middleware,async(req,res)=>{

    const parsedData=CreateRoomSchema.safeParse(req.body);

    if(parsedData.error){
        return res.status(400).json({
            message: "Please provide a valid room name"
        });
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
    catch(e: any){
        console.error("Room creation error:", e);

        // Handle specific database errors
        if (e.code === 'P2002') {
            return res.status(400).json({
                message: 'A room with this name already exists'
            });
        }

        return res.status(500).json({
            message: 'Unable to create room. Please try again.'
        });
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`HTTP Backend running on port ${PORT}`);
});