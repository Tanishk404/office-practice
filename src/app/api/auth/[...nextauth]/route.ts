import { DbConnection } from "@/lib/Db";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth"


export const authOptions:NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name : "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}

            },
            async authorize(credentials):Promise<any> {
                await DbConnection()
                const user = await UserModel.findOne({email: credentials?.email}).select("+password");

                if(!user){
                    console.log("not found user")
                    throw new Error("User is not registered")
                }

                if(!user?.password || !credentials?.password){
                    console.log("passwords are missing")
                    return null
                } 

                const matchPass = await bcrypt.compare(credentials?.password as string, user?.password)

                if(!matchPass) {
                    console.log("  Invalid password ")
                    throw new Error("invalid credentials")
                }


                return {
                    id: user._id.toString(),
                    email: user.email,
          
                };
            }

        })
    ],
    
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({token, user}):Promise<any> {
            if(user) {
                token.id = user.id;

            }

            return token;

        },

        async session({ session, token }) {
        if (session.user && token.id) {
            session.user.id = token.id as string;
        }
            return session;
        },


    },

    pages: {
        signIn: "/login"
    },

    secret: process.env.NEXTAUTH_SECRET

}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }