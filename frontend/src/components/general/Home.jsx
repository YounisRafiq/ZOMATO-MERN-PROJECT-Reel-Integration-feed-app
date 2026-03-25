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
  const [savedVideos, setSavedVideos] = useState([]);
  const [isSavedMap, setIsSavedMap] = useState(new Map());
  const [isLikedMap, setIsLikedMap] = useState(new Map());
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [checking, setChecking] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'saved'
  const [activeNav, setActiveNav] = useState('home'); // 'home' or 'saved'
  const navigate = useNavigate();

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

  const handlePlusClick = async () => {
    if (checking) return;
    setChecking(true);
    try {
      await axios.get("http://localhost:3000/api/food-partner/me", { withCredentials: true });
      navigate("/create-food");
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/food-partner/login");
    } finally {
      setChecking(false);
    }
  };

  const toggleSave = async (reelId) => {
    try {
      await axios.post("http://localhost:3000/api/food/save", { foodId: reelId }, { withCredentials: true });
      
      setIsSavedMap(prev => {
        const newMap = new Map(prev);
       newMap.set(reelId, !(newMap.get(reelId) || false));
        return newMap;
      });

      // Refetch to update counts
      await fetchVideos();
    } catch (error) {
      console.error("Save toggle failed:", error);
    }
  };

  const toggleLike = async (reelId) => {
    try {
      await axios.post("http://localhost:3000/api/food/like", { foodId: reelId }, { withCredentials: true });
      
      setIsLikedMap(prev => {
        const newMap = new Map(prev);
        newMap.set(reelId, !(newMap.get(reelId) || false));
        return newMap;
      });

      // Refetch to update counts
      await fetchVideos();
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  };

  const toggleComment = async (reelId) => {
    try {
      await axios.post("http://localhost:3000/api/food/comment", { foodId: reelId }, { withCredentials: true });
      
      // Refetch to update counts
      await fetchVideos();
    } catch (error) {
      console.error("Comment toggle failed:", error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/food", { withCredentials: true });
      setVideo(response.data.data || []);
      
      // Update saved map
      if (response.data.data) {
        const newMap = new Map();
        response.data.data.forEach(reel => {
          newMap.set(reel._id, reel.userSaves?.includes(response.data.user?._id) || false);
        });
        setIsSavedMap(newMap);
      }
    } catch (error) {
      console.error("Fetch videos failed:", error);
    }
  };

  const fetchSavedVideos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/food/save", { withCredentials: true });
      setSavedVideos(response.data.data || []);
    } catch (error) {
      console.error("Fetch saved videos failed:", error);
    }
  };

  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) video.pause();
      });
    };
  }, []);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      handleScroll();
    }
  }, [videos, handleScroll]);

  return (
    <>
      <div ref={containerRef} className="reels-container">
{(viewMode === 'all' ? videos : savedVideos).map((reel, index) => (
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

            <div className="interaction-sidebar">
              <div className="interaction-item" onClick={() => toggleLike(reel._id)} style={{cursor: 'pointer'}}>
                <span className={`interaction-icon ${isLikedMap.get(reel._id) ? 'liked' : ''}`}>
                  <i className={isLikedMap.get(reel._id) ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                </span>
                <span className="icon-count">{reel.likeCount || 0}</span>
              </div>
              <div className="interaction-item" onClick={() => toggleComment(reel._id)} style={{cursor: 'pointer'}}>
                <span className="interaction-icon"><i className="fa-regular fa-comment"></i></span>
                <span className="icon-count">{reel.commentCount || 0}</span>
              </div>
              <div className="interaction-item" onClick={() => toggleSave(reel._id)} style={{cursor: 'pointer'}}>
                <span className={`interaction-icon ${isSavedMap.get(reel._id) ? 'saved' : ''}`}>
                  <i className={isSavedMap.get(reel._id) ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                </span>
                <span className="icon-count">{reel.saveCount || 0}</span>
              </div>
            </div>
          </section>
        ))}
      </div>

      <nav className="bottom-nav" style={{
        position: 'fixed',
        bottom:  '0',
        left: '48.5%',
        transform: isSmallDevice ? "translateX(-48.5%)" : "translateX(-50%)",
        width: isSmallDevice ? "101vw" : "335.6px",
        // maxWidth: '90vw',
        height: isSmallDevice ? '55px' : '50px',
        // background: isSmallDevice ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        // borderRadius: isSmallDevice ? '20px' : '28px',
        border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        // boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
        zIndex: 40
      }}>
        <button 
          onClick={() => {
            setActiveNav('home');
            navigate('/');
          }} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: activeNav === 'home' ? '#60a5fa' : 'rgba(255,255,255,0.8)', 
            fontSize: isSmallDevice ? '20px' : '22px',
            cursor: 'pointer',
            padding: '12px 16px',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            fontWeight: activeNav === 'home' ? '600' : '500'
          }}
          className={activeNav === 'home' ? 'active-nav' : ''}
          title="Home"
        >
          <i className="fa-solid fa-house"></i>
          <span style={{fontSize: '12px', fontWeight: 500}}>Home</span>
        </button>
        
        <div style={{position: 'relative'}}>
          <button
            onClick={handlePlusClick}
            disabled={checking}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 8px 32px rgba(255, 65, 108, 0.5)',
              cursor: checking ? 'not-allowed' : 'pointer',
              opacity: checking ? 0.7 : 1,
              zIndex: 45,
              transition: 'all 0.2s ease'
            }}
          >
            {checking ? '...' : '+'}
          </button>
        </div>
        
        <button 
          onClick={() => {
            setActiveNav('saved');
            setViewMode(viewMode === 'all' ? 'saved' : 'all');
            if (viewMode === 'all') {
              fetchSavedVideos();
            }
          }} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: activeNav === 'saved' ? '#60a5fa' : 'rgba(255,255,255,0.8)', 
            fontSize: isSmallDevice ? '20px' : '22px',
            cursor: 'pointer',
            padding: '12px 16px',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            fontWeight: activeNav === 'saved' ? '600' : '500'
          }}
          className={activeNav === 'saved' ? 'active-nav' : ''}
          title="Saved"
        >
          <i className="fa-solid fa-bookmark"></i>
          <span style={{fontSize: '12px', fontWeight: 500}}>Saved</span>
        </button>
      </nav>
    </>
  );
};

export default Home;

