import React, { useState , useEffect } from 'react';
import './Dashboard.css'
import { useParams } from 'react-router-dom';
import axios from 'axios'
const Dashboard = () => {
  const { id } = useParams();
  const [profile , setprofile] = useState([]);

   useEffect(() => {
    axios.get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true })
  .then(res => setprofile(res.data.foodPartner))
   } ,[id])


  return (
    <div className="dashboard">
      <div className="profile-section">
        <img src="https://via.placeholder.com/120x120/FF6B6B/FFFFFF?text=BP" alt="Business Profile" className="profile-photo" />
        <div className="profile-info">
          <h2>{profile?.name}</h2>
          <p>{profile?.address}</p>
          <hr className="divider" />
          <div className="stats-row">
            <div className="stat-card">
              <h3>Total Meals</h3>
              <span>{profile?.totalMeals}</span>
            </div>
            <div className="stat-card">
              <h3>Customers Served</h3>
              <span>{profile?.customersServed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

