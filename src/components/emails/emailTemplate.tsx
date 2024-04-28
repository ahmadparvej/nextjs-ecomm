import React from 'react'
import { Button } from '@/components/ui/button';

interface IVerificationEmail {
  otp: string;
  name: string;
  email: string;
}

const EmailTemplate = ( {otp, name, email}: IVerificationEmail) => {
  return (
    <div>
      <div>Hi, {name}</div>
      <div>This mail is regarding verification.</div>
      <div className='text-lg'>Your OTP is {otp}</div>
      <button>
        <a href={`http://localhost:3000/verify?email=${email}`} >Click to Verify</a>
      </button>
    </div>
  )
}

export default EmailTemplate