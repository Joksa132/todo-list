import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import styles from "./login.module.css";
import Image from "next/image";
import LoginButton from "@/components/LoginButton";

export default async function Login() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-left-side"]}>
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
      <div className={styles["login-right-side"]}>
        <h2>Sign in</h2>
        <LoginButton provider="Google" />
        <div className={styles["seperation-line"]}>
          <div className={styles.line}></div>
          <div className={styles["line-text"]}>OR</div>
          <div className={styles.line}></div>
        </div>
        <LoginButton provider="GitHub" />
      </div>
    </div>
  );
}
