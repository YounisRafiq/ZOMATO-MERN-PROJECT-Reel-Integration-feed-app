// src/components/UserRegister/UserRegister.jsx
import "./foodPartnerRegister.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserRegister() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(name , contactName , phone , address , email , password);

    try {
      const response = await axios.post("http://localhost:3000/api/auth/food-partner/register" , {
        name,
        contactName,
        phone,
        address,
        email,
        password
      } , { withCredentials : true });
      console.log(response.data);
      navigate("/create-food");
    } catch (error) {
      console.log("Something Went Wrong" , error);
    }
  }
  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Being a Food Partner</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Enter Business Name" />
          <input type="text" name="contactName" placeholder="Contact Name" />
          <input type="text" name="phone" placeholder="Phone Number" />
          <input type="text" name="address" placeholder="Address" />
          <input type="email" name="email" placeholder="Email Address" />
          <input type="password" name="password" placeholder="Password" />

          <button type="submit" className="register-btn">Register</button>
        </form>

          <p className="register-login">
 Already have an account? 
  <span>
    <a href="/food-partner/register">LogIn</a>
  </span>
</p>
      </div>
    </div>
  );
};