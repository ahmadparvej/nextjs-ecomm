import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import { connect } from '@/db/db';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email ", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req): Promise<any> {
               await connect();
                console.log(credentials)
               try {
                    const user = await User.findOne({
                        $or:[
                            { email: credentials?.email}
                        ]
                    })

                    if(!user){
                        throw new Error('No user found wiith this email!')
                    }
                    if(!user.isVerified){
                        throw new Error('User not verified!')
                    }

                    const isPasswordValid = await bcrypt.compare(credentials?.password!, user?.password)
                    if(isPasswordValid){
                        return user
                    }else{
                        throw new Error('Incorrect Password')
                    }

               } catch (error: any) {
                    throw new Error(error)
               }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString(),
                token._isVerified = user.isVerified,
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }
            return token
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET
}