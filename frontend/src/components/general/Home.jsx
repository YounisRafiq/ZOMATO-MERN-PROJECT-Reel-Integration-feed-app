import React, { useRef, useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";

const Home = () => {
  const videoRefs = useRef([]);
  const isUpdating = useRef(false);
  const containerRef = useRef(null);
  const animationId = useRef(null);
  const [videos, setVideo] = useState([]);
  const [checking, setChecking] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const enableAudio = () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.muted = true;
          video.volume = 1;
        }
      });
    };

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
    const center = scrollTop + containerHeight / 2;

    videoRefs.current.forEach((video, index) => {
      const item = items[index];
      if (!video || !item) return;

      const itemCenter = item.offsetTop + item.offsetHeight / 2;
      const distance = Math.abs(center - itemCenter);

      const isActive = distance < item.offsetHeight / 2;

      if (isActive) {
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
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
   if(isLoggedIn){
    navigate("/create-food");
   } else{
    navigate("/food-partner/login");
   }
  };

  const checkAuth = async () => {
  try {
    await axios.get("http://localhost:3000/api/food-partner/me", {
      withCredentials: true,
    });

    setIsLoggedIn(true);
  } catch (error) {
    console.log("Auth check failed:", error.response?.data || error);
    setIsLoggedIn(false);
  }
};

 useEffect(() => {
  checkAuth();
}, []);

  const handleToggleSound = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = newMutedState;
      }
    });

    setShowIcon(true);

    setTimeout(() => {
      setShowIcon(false);
    }, 1500);
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

 const logout = async () => {
  const response = window.confirm("Are you sure you want to logout?");
  if (!response) return;

  try {
    const res = await axios.get(
      "http://localhost:3000/api/auth/food-partner/logout",
      { withCredentials: true }
    );

    console.log(res.data);

    setIsLoggedIn(false);
    alert("Logout successful!");
  } catch (error) {
    console.log(error.response?.data || error);
    alert("Logout failed. Please try again.");
  }
};

   

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      handleScroll();
    }
  }, [videos, handleScroll]);

  useEffect(() => {
    const enableAllSound = () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.muted = false;
          video.volume = 1;
        }
      });
    };

    window.addEventListener("click", enableAllSound, { once: true });
  }, []);


  const toggleLike = async (reel) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: reel._id },
        { withCredentials: true },
      );

      const { isLiked, likeCount } = res.data;
      
      isUpdating.current = true;

      setVideo((prev) =>
        prev.map((item) =>
          item._id === reel._id ? { ...item, isLiked, likeCount } : item,
        ),
      );
      setTimeout(() => {
  isUpdating.current = false;
}, 300);
    } catch (error) {
      console.error("Like action failed:", error);

    }
  };

  const saveReel = async (reel) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/food/save",
      { foodId: reel._id },
      { withCredentials: true }
    );

    const { isSaved, saveCount } = res.data;
    isUpdating.current = true;

    setVideo(prev =>
      prev.map(item =>
        item._id === reel._id
          ? {
              ...item,
              isSaved,
              saveCount
            }
          : item
      )
    );
    setTimeout(() => {
  isUpdating.current = false;
}, 300);

  } catch (error) {
    console.error("Save action failed:", error);
  }
};

  const login = () => {
    navigate("/food-partner/login");
    return;
  };

  return (
    <>
      <div ref={containerRef} className="reels-container">
        {videos.map((reel, index) => (
          <section key={reel._id} id={`reel-${reel._id}`} className="reel-item">
            {showIcon && (
              <div className="sound-icon">{isMuted ? "🔇" : "🔊"}</div>
            )}
            <video
            key={reel._id}
              ref={(el) => {
                if (el) videoRefs.current[index] = el;
              }}
              className="reel-video"
              loop
              muted
              autoPlay
              playsInline
              preload="auto"
              onClick={handleToggleSound}
            >
              <source src={reel.video} type="video/mp4" />
            </video>

            <div className="bottom-overlay">
              <div className="user">
                <img
                  style={{
                    width: "25px",
                    objectFit: "cover",
                    height: "25px",
                    borderRadius: "50%",
                  }}
                  src={reel.foodPartner?.profile}
                  alt="This is profile photo"
                />
                <p className="author">{"@" + reel.foodPartner?.name}</p>
              </div>
              <p className="title">{reel.name}</p>
              <p className="description">{reel.description}</p>
            </div>

            <Link
              className="visit-store-btn"
              to={isLoggedIn ? `/food-partner/${reel.foodPartner?._id}` : "/food-partner/login"}
            >
              Visit Profile
            </Link>

            <div className="interaction-sidebar">
              <div>
                <i
                  onClick={() => toggleLike(reel)}
                  className={`fa-heart like-icon ${
                    reel.isLiked ? "fa-solid liked" : "fa-regular"
                  }`}
                ></i>

                <span>{reel.likeCount}</span>
              </div>

              <div>
                <i
                  style={{ color: "whitesmoke" }}
                  className="fa-regular fa-comment"
                ></i>{" "}
                <span>{reel.commentCount}</span>
              </div>

              <div>
                <i
                  onClick={() => saveReel(reel)}
                  style={{ color: "whitesmoke", cursor: "pointer" }}
                  className={
                    reel.isSaved
                      ? "fa-solid fa-bookmark"
                      : "fa-regular fa-bookmark"
                  }
                ></i>
                <span>{reel.saveCount}</span>
              </div>
            </div>
          </section>
        ))}
      </div>

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
          className="btn"
          onClick={handlePlusClick}
          disabled={checking}
          style={{
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
            borderRadius: "50%",
            border: "none",
            fontSize: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontWeight: "bold",
            cursor: checking ? "not-allowed" : "pointer",
            opacity: checking ? 0.7 : 1,
          }}
        >
          +
        </button>
      </div>

      <button onClick={isLoggedIn ? logout : login} className="logout">
        {isLoggedIn ? "Logout" : "Login"}
      </button>
      {error && <p className="error-text">{error}</p>}
    </>
  );
};

export default Home;
