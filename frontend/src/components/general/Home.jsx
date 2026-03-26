import React, { useRef, useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";

const Home = () => {
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const animationId = useRef(null);
  const [videos, setVideo] = useState([]);
  const [isLikedMap, setIsLikedMap] = useState(new Map());
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSize = () => setIsSmallDevice(window.innerWidth <= 480);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
  const enableAudio = () => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.muted = false;
        video.volume = 1;
      }
    });
  };

  window.addEventListener("click", enableAudio, { once: true });

  return () => window.removeEventListener("click", enableAudio);
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
  setActiveVideoIndex(index);

  video.play().catch(() => {});
  video.muted = false;   
} else {
  video.pause();
  video.currentTime = 0;
  video.muted = true;  
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

  const handlePlusClick = async () => {
    if (checking) return;
    setChecking(true);
    try {
      await axios.get("http://localhost:3000/api/food-partner/me", {
        withCredentials: true,
      });
      navigate("/create-food");
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/food-partner/login");
    } finally {
      setChecking(false);
    }
  };

  const toggleLike = async (reelId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: reelId },
        { withCredentials: true }
      );

      setIsLikedMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(reelId, !(newMap.get(reelId) || false));
        return newMap;
      });

      await fetchVideos();
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  };

  const toggleComment = async (reelId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/food/comment",
        { foodId: reelId },
        { withCredentials: true }
      );

      await fetchVideos();
    } catch (error) {
      console.error("Comment toggle failed:", error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/food", {
        withCredentials: true,
      });
      setVideo(response.data.data || []);
    } catch (error) {
      console.error("Fetch videos failed:", error);
    }
  };

  useEffect(() => {
  if (videos.length > 0) {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
    });
  }
}, [videos]);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      handleScroll();
    }
  }, [videos, handleScroll]);

const togglePlayPause = (index) => {
  const video = videoRefs.current[index];
  if (!video) return;

  if (video.paused) {
    video.play();
    video.muted = false;
  } else {
    video.pause();
  }
};

  return (
    <>
      <div ref={containerRef} className="reels-container">
        {videos.map((reel, index) => (
          <section key={reel._id} className="reel-item">
            <video
              ref={(el) => {
                if (el) videoRefs.current[index] = el;
              }}
              className="reel-video"
              loop
              muted={index !== activeVideoIndex}
              autoPlay
              playsInline
              preload="auto"
              onClick={() => togglePlayPause(index)}
            >
              <source src={reel.video} type="video/mp4" />
            </video>

  
    
            <div className="bottom-overlay">
              <p className="title">{reel.name}</p>
              <p className="description">{reel.description}</p>
            </div>

            <Link
              to={"/food-partner/" + reel.foodPartner}
              className="visit-store-btn"
            >
              Visit Profile
            </Link>

            <div className="interaction-sidebar">
              <div onClick={() => toggleLike(reel._id)}>
                ❤️ {reel.likeCount}
              </div>

              <div onClick={() => toggleComment(reel._id)}>
                💬 {reel.commentCount}
              </div>

              <div>
                🔖 {reel.saveCount}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* PLUS BUTTON */}
      <div
        style={{
          position: "fixed",
          bottom: "0px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 45,
        }}
      >
        <button
          onClick={handlePlusClick}
          disabled={checking}
          style={{
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
            borderRadius: "50%",
            border: "none",
            fontSize: "28px",
            color: "white",
            fontWeight: "bold",
            cursor: checking ? "not-allowed" : "pointer",
            opacity: checking ? 0.7 : 1,
          }}
        >
          +
        </button>
      </div>
    </>
  );
};

export default Home;