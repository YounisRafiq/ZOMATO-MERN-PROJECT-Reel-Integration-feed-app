import React, { useState , useEffect } from 'react';
import './Dashboard.css'
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const Dashboard = () => {

  const Navigate = useNavigate();
  const [hasAlertShown, setHasAlertShown] = useState(false);
  const [loading, setLoading] = useState(true);


  const { id } = useParams();
  const [profile , setprofile] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/food-partner/${id}`,
        { withCredentials: true }
      );

      setprofile(res.data.foodPartner);

      const videoRes = await axios.get(
        `http://localhost:3000/api/food?foodPartner=${id}`,
        { withCredentials: true }
      );

      setVideos(videoRes.data.data);

    } catch (err) {
      if (err.response?.status === 401 && !hasAlertShown) {
        alert("You've to login first");
        Navigate("/food-partner/login");
        setHasAlertShown(true);
        return;
      } else {
        console.error("Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

  return (
    <div className="dashboard">

      <Link className='home' to={"/"}>Back to Home</Link>
      {loading && <p>Loading...</p>}
      <div className="profile-section">
        <img src={profile?.profile} alt="Business Profile" className="profile-photo" />
        <div className="profile-info">
          <h2>{profile?.name}</h2>
          <p>{"@" + profile?.contactName}</p>
          <hr className="divider" />
          
        </div>
      </div>

      {videos.length > 0 && (
        <div className="videos-section">
          <h3>Uploaded Videos</h3>
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

