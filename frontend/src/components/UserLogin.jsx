import "./UserLogin.css";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function UserLogin() {

      const navigate = useNavigate();

  const handleSubmit = async(e) => {
     e.preventDefault();

     const email = e.target.email.value;
     const password = e.target.password.value;
     console.log(email , password)

     try {
      const response = await API.post("/api/auth/user/login", {
      email,
      password
     } , {withCredentials : true});
     console.log(response);
     navigate("/")
     } catch (error) {
       console.log("Something went wrong" , error);
     }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Login</h2>

        <form className="register-form" onSubmit={handleSubmit} method="post">
          <input type="email" name="email" placeholder="Email Address" />
          <input type="password" name="password" placeholder="Password" />

          <button type="submit" className="register-btn">Login</button>
        </form>

          <p className="register-login">
  Not having an account? 
  <span>
    <Link to="/user/register">Sign Up</Link>
  </span>
</p>
      </div>
    </div>
  );
}