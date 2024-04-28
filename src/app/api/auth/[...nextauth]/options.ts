import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import { connect } from '@/db/db';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';
import { signIn } from 'next-auth/react';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

            profile(profile){
                console.log(profile)
                let userRole = "google user"
                return {...profile, id: profile.sub, role: userRole }
            }
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
            let payload = {...session, token }
            return payload
        },
        async jwt({ token, user, profile }) {
            token.picture = profile?.image
            return token
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}