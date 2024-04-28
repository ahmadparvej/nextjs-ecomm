import { resend } from "@/lib/resend";

import EmailTemplate from "@/components/emails/emailTemplate";

export async function sendVerificationEmail(
    name: string,
    email: string,
    author: string,
    verificationCode: string,
){
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: `${author} Verification Email`,
            react: EmailTemplate({otp: verificationCode, name, email}),
        });
        if(error){
            console.log("sending email: ",error)
            return { success: false }
        }
        if(data?.id){
            console.log("sending email: ",data)
            return { success: true, id: data.id }
        }
        console.log(data, error)
    } catch (error) {
        console.log("Error while sending verification email")
        return error
    }
}