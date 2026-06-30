import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomBytes, randomUUID }from "crypto";
import { createClient } from "redis";
import path from "node:path";
import { writeFile } from "node:fs/promises";

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
    const submissionId =  randomUUID();
    const { id } = await prisma.submission.create({
        data:{
            submissionId,
            status:"PROCESSING",

        }
    })
    await publisher.lPush("problem-queue", JSON.stringify({ language , id }));
    const jsPath =  path.resolve("../runner/js/main.js");
    await  writeFile( jsPath , code ,"utf-8" );
    return res.status(200).json({ message: " processing ", id });
})


app.get("/submission/:id",async ( req, res )=>{
    const id = req.params.id;
    const result = await prisma.submission.findFirst({
        where:{
            id: id
        }
    }) 
    if( !result )
        return res.status( 403 ).json({message:"Invalid id"})
    return res.status( 200 ).json({ status : result.status , result: result.result});
})


app.get('/submission',( req, res )=>{
    return res.status(200).json({ message :"Hi from server"})
})


app.listen(3000,()=>{
    console.log( "server running ")
})