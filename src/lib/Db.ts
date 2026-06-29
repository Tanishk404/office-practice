import mongoose from 'mongoose'

const Db_url = process.env.MONGODB_URI as string

if(!Db_url){
    throw new Error('db url missing')  
} 

let cached = (global as any).mongoose;
if(!cached){
    cached = (global as any).mongoose = {
        conn: null, 
        promise: null
    };
    
}

export async function DbConnection(){
    try {
        if(cached.conn) {
            return cached.conn
        }
    
        if(!cached.promise){
            cached.promise = mongoose.connect(Db_url)
        }
        
        cached.conn = await cached.promise;
        console.log("Data base connection successfull🟢");
    
        return cached.conn

    } catch(error:any) {
        cached.promise = null;
        console.log("MongoDb Error", error);
        throw error;
    }
}