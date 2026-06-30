const backend_url = "http://localhost:3000";


export const postApi = async ({ code ,language })=>{
    const res  =  await fetch( `${ backend_url }/submission`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ language, code })
    })
    const data = await res.json();
    
    return pollBackend( data.id );
    
}


async function pollBackend( id: string )
{
   
    const res = await fetch(`${ backend_url}/submission/${id}`,{
        method:"GET",
        headers:{
            "content-type":"application/json"
        }
    })
    const data = await res.json();

    if( data.status === "PENDING" || data.status === "PROCESSING" )
    {
        await new Promise((r)=>{
            setTimeout(r,1000);
        }
    )

       return  pollBackend( id );
    }

    return data;

    
}