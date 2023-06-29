import Link from "next/link";

export default function Login() {

  return (
    <div className="user-form-container">
      <div className="form-left-side">

      </div>
      <form className="form-right-side">
        <h2>Sign in</h2>
        <input type="email" placeholder="email address" name="email" />
        <input type="password" placeholder="password" name="password" />
        <button type="submit">Sign in</button>
        <Link href="/register">
          <span className="form-redirect-msg">Don't have an account? Sign up</span>
        </Link>
      </form>
    </div>
  )
}