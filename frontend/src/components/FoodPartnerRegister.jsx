import "./FoodPartnerRegister.css";
import API from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FoodPartnerRegister() {

  const [error , setError] = useState(null);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
        const name = e.target.name.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const profile = e.target.profile.files[0];


    const formData = new FormData();
formData.append("name", name);
formData.append("contactName", contactName);
formData.append("phone", phone);
formData.append("address", address);
formData.append("email", email);
formData.append("password", password);
formData.append("profile", profile);
    console.log(name , contactName , phone , address , email , password , profile);

    try {
      const response = await API.post("/api/auth/food-partner/register", formData);
      console.log(response.data);
      alert(response.data.message);
      navigate("/create-food");
    } catch (error) {
       console.log("Something Went Wrong" , error);
       if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message)
       } else {
        setError("Something Went Wrong");
       }
    }
  }
  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">SignUp as Zoomi User</h2>
         
         
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Enter your original name" />
          <input type="text" name="contactName" placeholder="Enter your second name" />
          <input type="text" name="phone" placeholder="Phone Number" />
          <input type="text" name="address" placeholder="Address" />
          <input type="email" name="email" placeholder="Email Address" />
          <input type="password" name="password" placeholder="Password" />
          <input type="file" name="profile" accept="image/*" />
          <button type="submit" className="register-btn">SignUp</button>
          {error && <p className="error-text">{error}</p>}
        </form>

          <p className="register-login">
 Already have an account? 
  <span>
    <a href="/food-partner/login">LogIn</a>
  </span>
</p>
      </div>
    </div>
  );
};