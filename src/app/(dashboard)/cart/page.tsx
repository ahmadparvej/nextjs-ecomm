"use client"
import { useSession } from 'next-auth/react';

const Cart = () => {

    const { data: session } = useSession()
    const user = session?.user?.name

    return (
        <div>
            <div>Cart</div>
            <div>active user: {user? user: "No"}</div>
        </div>
    )
}

export default Cart;