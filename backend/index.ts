import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client/extension";
import { PrismaPg } from "@prisma/adapter-pg";

const app =  express();

const prisma =  new PrismaClient(
    {
        adapter: new PrismaPg({ connectionString : process.env.DATABASE_URL });
    }
)
app.use( express.json() );
app.use(cors());

app.post("/submission" ,( req, res ) =>{
    await prisma.submission.create({
        data:{
            
        }
    })
    return res.status(200).json({ message: " processing "});
})



app.get('/submission',( req, res )=>{
    return res.status(200).json({ message :"Hi from server"})
})


app.listen(3000,()=>{
    console.log( "server running ")
})