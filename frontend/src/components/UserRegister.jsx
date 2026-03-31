import "./UserRegister.css";
import API from '../api';
import { useNavigate } from "react-router-dom";
export default function UserRegister() {

   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

   const response = await API.post("/api/auth/user/register", {
      fullName : firstName + " " + lastName,
      email,
      password

    } , {
      withCredentials : true
    });
    console.log(response.data);
    navigate("/");
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Sign up to get started</p>

        <form className="register-form" onSubmit={handleSubmit} method="post">
          <input type="text" name="firstName" placeholder="First Name" />
          <input type="text" name="lastName" placeholder="Last Name" />
          <input type="email" name="email" placeholder="Email Address" />
          <input type="password" name="password" placeholder="Password" />

          <button type="submit" className="register-btn">Register</button>
        </form>

          <p className="register-login">
  Already have an account? 
  <span>
    <a href="/user/login">LogIn</a>
  </span>
</p>
      </div>
    </div>
  );
}