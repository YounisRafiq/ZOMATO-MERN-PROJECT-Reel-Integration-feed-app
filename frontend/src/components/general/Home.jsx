import React, { useRef, useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";

const Home = () => {
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const animationId = useRef(null);
  const [videos, setVideo] = useState([]);
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsSmallDevice(window.innerWidth <= 480);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleScroll = useCallback(() => {
    if (animationId.current) cancelAnimationFrame(animationId.current);

    animationId.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      const items = container.children;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const containerCenter = scrollTop + containerHeight / 2;

      videoRefs.current.forEach((video, index) => {
        const item = items[index];
        if (!video || !item) return;

        video.muted = true;
        video.playsInline = true;

        const itemTop = item.offsetTop;
        const itemHeightReal = item.offsetHeight;
        const itemCenter = itemTop + itemHeightReal / 2;

        const distance = Math.abs(containerCenter - itemCenter);

        if (distance < itemHeightReal / 2) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });

      handleScroll();

      return () => {
        container.removeEventListener("scroll", handleScroll);
        if (animationId.current) cancelAnimationFrame(animationId.current);
      };
    }
  }, [handleScroll]);

  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) video.pause();
      });
    };
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((response) => {
        setVideo(response.data.data || []);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error happening while fetching the API", error);
      });
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      handleScroll();
    }
  }, [videos, handleScroll]);

  return (
    <div ref={containerRef} className="reels-container">
      {videos.map((reel, index) => (
        <section key={reel._id} className="reel-item">
          <video
            ref={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            className="reel-video"
            loop
            preload="auto"
            disablePictureInPicture
          >
            <source src={reel.video} type="video/mp4" />
          </video>

          <div className="bottom-overlay">
             <p className="title">
              {reel.name.length > 20
                ? reel.name.slice(0, 30) + "..."
                : reel.name}
            </p>
            <p className="description">
              {reel.description.length > 40
                ? reel.description.slice(0, 40) + "..."
                : reel.description}
            </p>
            <p className="author">{"@" + reel._id}</p>
          </div>

          <Link
            to={"/food-partner/" + reel.foodPartner}
            className="visit-store-btn"
            style={{ textDecoration: "none" }}
          >
            Visit Store
          </Link>
          <Link
            to="/create-food"
            style={{
              position: 'fixed',
              bottom: isSmallDevice ? '25px' : '20px',
              right: isSmallDevice ? '16px' : '24px',
              left: isSmallDevice ? 'auto' : '50%',
              transform: isSmallDevice ? 'none' : 'translateX(-50%)',
              width: isSmallDevice ? '48px' : '52px',
              height: isSmallDevice ? '48px' : '52px',
              background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isSmallDevice ? '26px' : '28px',
              color: 'white',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(255, 65, 108, 0.4)',
              zIndex: 20,
              fontWeight: 'bold'
            }}
          >
            +
          </Link>

          <div className="interaction-sidebar">
            <div className="interaction-item">
              <span className="interaction-icon"><i className="fa-regular fa-heart"></i></span>
              <span className="icon-count">{reel.likes?.length || 0}</span>
            </div>
            <div className="interaction-item">
              <span className="interaction-icon"><i className="fa-regular fa-comment"></i></span>
              <span className="icon-count">{reel.comments?.length || 0}</span>
            </div>
            <div className="interaction-item">
              <span className="interaction-icon"><i className="fa-regular fa-bookmark"></i></span>
              <span className="icon-count">{reel.saves?.length || 0}</span>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;

