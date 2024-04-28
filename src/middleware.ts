import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt"
import { withAuth } from 'next-auth/middleware';

// This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {

//     const token = await getToken({req: request})

//     console.log(token)

//     if(!token && request.nextUrl.pathname.startsWith("/cart")){
//         return NextResponse.redirect( new URL('/sign-in', request.url))
//     }

//     if(token && request.nextUrl.pathname.startsWith("/sign-in")){
//         return NextResponse.redirect( new URL('/cart', request.url))
//     }

//     return
// }

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request) {

    const token = request.nextauth.token
    console.log("at middleware =>",request.nextauth.token)

    if(!token && request.nextUrl.pathname.startsWith("/cart")){
      return NextResponse.redirect( new URL('/sign-in', request.url))
    }
  
    return
  },
  {
    callbacks: {
      authorized: ({ token }) =>{
        console.log(token)
        if(token){
          return true
        }
        return false
      },
    },
  },
)

export const config = {
    matcher: [
      '/cart'
    ],
  }