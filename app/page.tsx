"use client"

import styles from './page.module.css'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter()

  if (session?.user) {
    router.push('/dashboard')
  }

  return (
    <main className={styles.main}>
      <div className={styles["main-container"]}>
        <h2>To-Do App</h2>
        <p>With only the features you need, this app is customized for individuals seeking
          a stress-free way to stay focused on their goals, projects and tasks.
        </p>
        <Link href="/login">
          <button>Get Started</button>
        </Link>
      </div>
    </main>
  )
}
