import styles from "./page.module.css";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className={styles.main}>
      <div className={styles["image-container"]}>
        <Image
          src="/login-pic.jpg"
          alt="Login page picture"
          sizes="100vw"
          width={500}
          height={500}
          style={{
            objectFit: "cover",
          }}
          quality={100}
        />
      </div>
      <div className={styles["main-container"]}>
        <h2>To-Do App</h2>
        <p>
          With only the features you need, this app is customized for
          individuals seeking a stress-free way to stay focused on their goals,
          projects and tasks.
        </p>
        <Link href="/login" className={styles["login-button"]}>
          Get Started
        </Link>
      </div>
    </main>
  );
}
