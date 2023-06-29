import Link from "next/link";

export default function Login() {

  return (
    <div className="user-form-container">
      <div className="form-left-side">
        <img src="https://images.pexels.com/photos/461064/pexels-photo-461064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="person by a laptop" />
      </div>
      <div className="form-right-side">
        <form>
          <h2>Sign in</h2>
          <input type="email" placeholder="email address" name="email" />
          <input type="password" placeholder="password" name="password" />
          <button type="submit">Sign in</button>
          <Link href="/register">
            <span className="form-redirect-msg">Don't have an account? Sign up</span>
          </Link>
        </form>
      </div>
    </div>
  )
}