import "./foodPartnerLogin.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function UserLogin() {

   const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
      const password = e.target.password.value;
      const email = e.target.email.value;
      console.log(password , email)

      try {
        const response = await axios.post("http://localhost:3000/api/auth/food-partner/login" , {
          password,
          email
        } , {withCredentials : true});
        console.log(response.data);
        navigate("/create-food")
      } catch (error) {
        console.log("Something Went Wrong" , error.message)
      }
   }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Login as Food Partner</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email Address" />
          <input type="password" name="password" placeholder="Password" />

          <button type="submit" className="register-btn">Login</button>
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