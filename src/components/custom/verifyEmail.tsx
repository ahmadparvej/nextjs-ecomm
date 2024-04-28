"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [otp, setOtp] = useState<string>();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const onVerifyEmailClick = async () => {
    try {
      let res = await axios.post("/api/auth/verifyEmail", { email, otp });
      if (res.data.status === "success") {
        router.push("/sign-in");
      } else {
        console.log(res.data.message);
        toast.error(res.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email Address
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please click the button below to verify your email address.
          </p>
        </div>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value: any) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex justify-center">
          <button
            disabled={!otp || otp?.length < 5}
            onClick={onVerifyEmailClick}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Verify Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
