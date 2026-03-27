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
  const [showIcon, setShowIcon] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error , setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSize = () => setIsSmallDevice(window.innerWidth <= 480);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

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
      const containerCenter = scrollTop + containerHeight / 2;

      videoRefs.current.forEach((video, index) => {
        const item = items[index];
        if (!video || !item) return;

        video.playsInline = true;

        const itemTop = item.offsetTop;
        const itemHeightReal = item.offsetHeight;
        const itemCenter = itemTop + itemHeightReal / 2;
        const distance = Math.abs(containerCenter - itemCenter);

        if (distance < itemHeightReal / 2) {
          video.play().catch(() => {});
        } else {
          video.pause();
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

  const checkAuth = async () => {
  try {
    await axios.get("http://localhost:3000/api/food-partner/me", {
      withCredentials: true,
    });
    setIsLoggedIn(true);
  } catch (error) {
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

  const toggleLike = async (reelId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: reelId },
        { withCredentials: true },
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
        { withCredentials: true },
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

  const logout = async () => {
    try {
      setError(null);
      const response = await axios.get("http://localhost:3000/api/auth/food-partner/logout" , { withCredentials : true });
        setIsLoggedIn(false); 
      console.log(response.data);
      navigate("/")
      alert(response.data.message);
    } catch (error) {
      console.log(error.message);
      setError(error.response?.data?.message || "Logout failed , try again!")
    }
  }

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

  useEffect(() => {
    if (videoRefs.current[0]) {
      videoRefs.current[0].play().catch(() => {});
    }
  }, [videos]);

  useEffect(() => {
    if (videos.length > 0) {
      setTimeout(() => {
        const firstVideo = videoRefs.current[0];
        if (firstVideo) {
          firstVideo.play().catch(() => {});
        }
      }, 200);
    }
  }, [videos]);

  return (
    <>
      <div ref={containerRef} className="reels-container">
        {videos.map((reel, index) => (
          <section key={reel._id} className="reel-item">
            {showIcon && (
              <div className="sound-icon">{isMuted ? "🔇" : "🔊"}</div>
            )}
            <video
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
                <img style={{width : "25px" , objectFit : "cover" , height : "25px" , borderRadius : "50%"}} src={reel.foodPartner?.profile} alt="This is profile photo" />
              <p className="author">{"@" + reel.foodPartner?.name}</p>
              </div>
              <p className="title">{reel.name}</p>
              <p className="description">{reel.description}</p>
              
            </div>

            <Link
              to={"/food-partner/" + reel.foodPartner?._id}
              className="visit-store-btn"
            >
              Visit Profile
            </Link>

            <div className="interaction-sidebar">
              <div onClick={() => toggleLike(reel._id)}>
                <i style={{color : "whitesmoke"}} class="fa-regular fa-heart"></i> {reel.likeCount}
              </div>

              <div onClick={() => toggleComment(reel._id)}>
                <i style={{color : "whitesmoke"}} class="fa-regular fa-comment"></i> {reel.commentCount}
              </div>

              <div><i style={{color : "whitesmoke"}} class="fa-regular fa-bookmark"></i> {reel.saveCount}</div>
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
        <button className="btn"
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

      <button
  onClick={logout}
  className="logout"
  disabled={!isLoggedIn}
  style={{
    opacity: isLoggedIn ? 1 : 0.5,
    cursor: isLoggedIn ? "pointer" : "not-allowed",
  }}
>
  Logout
</button>
          {error && <p className="error-text">{error}</p>}
    </>
  );
};

export default Home;
