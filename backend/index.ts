import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomBytes, randomUUID }from "crypto";
import { createClient } from "redis";

const app =  express();

const prisma  = new PrismaClient({
    adapter: new PrismaPg({ connectionString : process.env.DATABASE_URL  })
})

const publisher  =  createClient({
    url: process.env.REDIS_URL
})

publisher.on("error",(err)=>{
    console.log(" redis client error ", err)

})

await publisher.connect();
console.log(" connecte to reds ") 


app.use( express.json() );
app.use(cors());

app.post("/submission" ,async ( req, res ) =>{
    const { language, code } = req.body;
     const id  = randomUUID();
    await prisma.submission.create({
        data:{
            submissionId : id,
            status:"PROCESSING",

        }
    })
    return res.status(200).json({ message: " processing ", id:id });
})



app.get('/submission',( req, res )=>{
    return res.status(200).json({ message :"Hi from server"})
})


app.listen(3000,()=>{
    console.log( "server running ")
})