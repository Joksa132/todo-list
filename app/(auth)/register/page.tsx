import Link from "next/link";

export default function Register() {

  return (
    <div className="user-form-container">
      <div className="form-left-side">
        <img src="https://images.pexels.com/photos/461064/pexels-photo-461064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="person by a laptop" />
      </div>
      <div className="form-right-side">
        <form>
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
    </div>
  )
}