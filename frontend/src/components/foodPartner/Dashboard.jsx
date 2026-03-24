import React, { useState , useEffect } from 'react';
import './Dashboard.css'
import { useParams } from 'react-router-dom';
import axios from 'axios'
const Dashboard = () => {
  const { id } = useParams();
  const [profile , setprofile] = useState([]);
  const [videos, setVideos] = useState([]);

   useEffect(() => {
    axios.get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true })
  .then(res => {
    setprofile(res.data.foodPartner)
    // Fetch videos for this food partner
    axios.get(`http://localhost:3000/api/food?foodPartner=${id}`, { withCredentials: true })
      .then(videoRes => setVideos(videoRes.data.data))
      .catch(err => console.error('Error fetching videos:', err))
  })
   } ,[id])

  return (
    <div className="dashboard">
      <div className="profile-section">
        <img src={profile?.profile} alt="Business Profile" className="profile-photo" />
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

      {videos.length > 0 && (
        <div className="videos-section">
          <h3>Your Videos</h3>
          <div className="videos-grid">
            {videos.map((video) => (
              <video 
                key={video._id} 
                className="video-item" 
                controls 
                src={video.video}
                muted
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

