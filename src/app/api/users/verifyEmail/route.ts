
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { connect } from '@/db/db';
import User from '@/models/user.model';

export async function POST (request: NextRequest) {
    try {
        connect();

        const req = await request.json();
        const { email, otp } = req;

        const user = await User.findOne({ email: email, verifyOTPExpiry: {$gt: Date.now()}, verifyOTP: otp });
        if(!user){
            return NextResponse.json({ status: "failed", message: "Invalid verification token" });
        }

        user.isVerified = true;
        user.verifyOTP = undefined;
        user.verifyOTPExpiry = undefined;

        await user.save()

        return NextResponse.json({ status: "success", message: "email verified!" });
    } catch (error: any) {
        return NextResponse.json({ status: "failed", message: error.message })
    }
}