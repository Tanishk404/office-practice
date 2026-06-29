import { DbConnection } from "@/lib/Db";
import { UserModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";




export async function POST(req:NextRequest){
    try {
        await DbConnection()
        const pass = 'admin2580'
        const password = await bcrypt.hash(pass, 10)
        const user = await UserModel.create({
            email: 'admin@gmail.com',
            password: password
        })

        console.log(user)
        return NextResponse.json(
            {msg: 'admin created successfull', 
                user: user
            },
            {status: 200}
        )

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {msg: 'something went wrong while create admin, Server Error'},
            {status: 400}
        )
        
    }
}