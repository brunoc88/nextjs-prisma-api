"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

const Navbar = () => {
    const { data: session } = useSession()
    const logOut = () => {
        signOut({
            callbackUrl: '/login'
        })
    }
    return (
        <div>
            <nav>
                {session ? (
                    <div>
                        <button onClick={logOut}>LogOut</button>
                        <ul>
                            <li><Link href={'/user/profile'}>Profile</Link></li>
                            <li><Link href={'/home'}>Home</Link></li>
                        </ul>
                    </div>
                ) : (
                    <ul>
                        <li><Link href={'/login'}>LogIn</Link></li>
                        <li><Link href={'/user/form'}>Registro</Link></li>
                    </ul>
                )}
            </nav>
        </div>
    )
}

export default Navbar