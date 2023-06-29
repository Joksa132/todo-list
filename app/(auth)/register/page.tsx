import Link from "next/link";

export default function Register() {

  return (
    <div className="user-form-container">
      <div className="form-left-side">

      </div>
      <form className="form-right-side">
        <h2>Sign up</h2>
        <input type="text" placeholder="username" name="username" />
        <input type="email" placeholder="email address" name="email" />
        <input type="password" placeholder="password" name="password" />
        <button type="submit">Sign up</button>
        <Link href="/login">
          <span className="form-redirect-msg">Already have an account? Sign in</span>
        </Link>
      </form>
    </div>
  )
}