"use client"

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const session = useSession();
  const router = useRouter();

  console.log(session)

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/')
    }
  }, [session])

  return (
    <div className="user-form-container">
      <div className="form-left-side">
        <img src="https://images.pexels.com/photos/461064/pexels-photo-461064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="person by a laptop" />
      </div>
      <div className="form-right-side">
        <h2>Sign in</h2>
        <button onClick={() => signIn("google")}>Sign in with Google!</button>
        <button onClick={() => signIn("github")}>Sign in with GitHub!</button>
      </div>
    </div>
  )
}