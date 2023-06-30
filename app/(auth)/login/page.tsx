"use client"

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './login.module.css'

export default function Login() {
  const session = useSession();
  const router = useRouter();

  console.log(session)

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [session])

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-left-side"]}>
        <img src="https://images.pexels.com/photos/461064/pexels-photo-461064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="person by a laptop" />
      </div>
      <div className={styles["login-right-side"]}>
        <h2>Sign in</h2>
        <button onClick={() => signIn("google")}>Sign in with Google!</button>
        <div className={styles["seperation-line"]}>
          <div className={styles.line}></div>
          <div className={styles["line-text"]}>OR</div>
          <div className={styles.line}></div>
        </div>
        <button onClick={() => signIn("github")}>Sign in with GitHub!</button>
      </div>
    </div>
  )
}