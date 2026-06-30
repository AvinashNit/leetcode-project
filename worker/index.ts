import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { createClient } from "redis";
import { spawn } from "node:child_process";
import  path  from "node:path";

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
        const problemObject  =  JSON.parse(object.element) ;
        const id = problemObject.id;
        const result =  await getResult({ langauge: problemObject.language });
        await prisma.submission.update({
            where:{
                id: id
            },
            data:{
                status : result?.statusCode === 0 ? "SUCCESS" : "FAILURE",
                result: result?.result
            }
        })
    }
    
}




async function getResult( { langauge })
{
    let result = "";
    let statusCode = -1 ;
    let filePath = null;
    switch( langauge )
    {
        case "js":
            {
                filePath = path.resolve("../runner/js");
                const child =  spawn("docker", [
                    "run",
                    "--rm",
                    "-v",
                    `${filePath}:/src`,
                    "js-runner",
                    "node",
                    "/src/main.js",

                ]);
                child.stdout.on("data", ( data )=>{
                    result += data.toString(); 
                } )
                
                child.stderr.on("data", ( data )=>{
                    result += data.toString();
                });

                await new Promise<void>( ( r )=>{
                    child.on("close" ,( code )=>{
                        statusCode = code! ;
                        r();
                    })
                })
                return { statusCode, result };
                

            }
    }
}

