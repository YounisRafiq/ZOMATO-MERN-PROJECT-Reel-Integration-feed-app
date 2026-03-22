import React, { useRef, useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";

const Home = () => {
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const animationId = useRef(null);
  const [videos, setVideo] = useState([]);

  const handleScroll = useCallback(() => {
    if (animationId.current) cancelAnimationFrame(animationId.current);

    animationId.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemHeight = containerHeight;

      const containerCenter = scrollTop + containerHeight / 2;

      videoRefs.current.forEach((video, index) => {
        if (!video) return;

        video.muted = true;
        video.playsInline = true;

        const itemTop = index * itemHeight;
        const itemCenter = itemTop + itemHeight / 2;

        const distance = Math.abs(containerCenter - itemCenter);

        if (distance < itemHeight / 2) {
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
        setVideo(response.data.foodItem);
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
            <p className="description">
              {reel.description.length > 20
                ? reel.description.slice(0, 30) + "..."
                : reel.description}
            </p>
            <p className="author">{reel._id}</p>
          </div>

          <Link
            to={"/food-partner/" + reel.foodPartner}
            className="visit-store-btn"
            style={{ textDecoration: "none" }}
          >
            Visit Store
          </Link>
        </section>
      ))}
    </div>
  );
};

export default Home;
