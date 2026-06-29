import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { createClient } from "redis";


const subscriber  =  createClient({
    url:  process.env.REDIS_URL
})

subscriber.on("error",( err )=>{
    console.log(" redis client error ", err );
})

await subscriber.connect();

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

console.log( process.env.DATABASE_URL )

while(true)
{
    const object =  await subscriber.brPop("problem-queue",0);
    if( object )
    {
        const problemObject  =  JSON.parse(object.element);
        //delegate to worker 
        //update db
        await prisma.submission.update({
            where:{
                id: problemObject.id
            },
            data:{
                status:"SUCCESS"
            }
        })
    }
}