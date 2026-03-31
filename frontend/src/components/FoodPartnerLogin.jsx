import { useState } from "react";
import "./FoodPartnerLogin.css";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function FoodPartnerLogin() {
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const password = e.target.password.value;
    const email = e.target.email.value;

    try {
      const response = await API.post(
        "/api/auth/food-partner/login",
        {
          password,
          email,
        },
      );
      console.log(response.data);
      alert(response.data.message);
      navigate("/create-food");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
       setError(error.response.data.message);
      } else {
       setError("Something Went Wrong!")
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Login as Zoomi user</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email Address" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit" className="register-btn">
            Login
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>
        <p className="register-login">
          Not having an account?
          <span>
            <a href="/food-partner/register">Sign Up</a>
          </span>

        </p>
      </div>
    </div>
  );
}
