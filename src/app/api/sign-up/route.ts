
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/db/db';
import User from '@/models/user.model';
import bcryptjs from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: NextRequest){
    await connect();

    try {
        
        const {name, email, password} = await request.json();

        const existingVerifiedUser = await User.findOne({email})

        // Return if user already exist
        if(existingVerifiedUser){
            return NextResponse.json({ success: false, message: "user already registered"});
        }

        // Create User
        const hashedPassword = await bcryptjs.hash(password, 10);
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 72);
        const OTP = (Math.floor(100000 + Math.random() * 900000)).toString();
        const newUser = await new User({
            name,
            email,
            password: hashedPassword,
            verifyOTPExpiry: expiryDate,
            verifyOTP: OTP,
            isVerified: false
        })
        
        // Send verification email
        const emailResponse: any = await sendVerificationEmail(name, email, "TechEng", OTP)
        console.log("send email:", emailResponse)
        if(!emailResponse.success){
            return NextResponse.json({ success: false, message: "Could not send verification email, try again"});
        }
        
        await newUser.save();
        return NextResponse.json({ success: true, message: "user registered, please verify your email!"})

    } catch (error) {
        console.log(error)

        return NextResponse.json({ success: false, message: "Error register user"})
    }
}