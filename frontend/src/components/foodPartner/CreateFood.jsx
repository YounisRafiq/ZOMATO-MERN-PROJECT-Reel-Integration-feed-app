import React, { useState, useRef } from 'react';
import "./createFood.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const CreateFood = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    video: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

const handleVideoChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    if (!file.type.startsWith('video/')) {
      setErrors({ video: 'Please select a valid video file' });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrors({ video: 'Video size must be less than 100MB' });
      return;
    }

    setFormData(prev => ({ ...prev, video: file }));
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setErrors(prev => ({ ...prev, video: '' }));
  }
};

  const validateForm = () => {
    const newErrors = {};
  if (!formData.name.trim()) newErrors.name = 'Food name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
  if (!formData.video) newErrors.video = 'Please select a video';
    setErrors(newErrors);
   return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submitData = new FormData();
       submitData.append('name', formData.name);
       submitData.append('description', formData.description);
       submitData.append('video', formData.video);

       const response = await axios.post("http://localhost:3000/api/food" , submitData , { withCredentials : true });
       console.log(response.data);
       navigate("/")

     await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Food uploaded successfully! (Demo)');
      
    // Reset form
       setFormData({ name: '', description: '', video: null });
       setPreviewUrl(null);
       if (fileInputRef.current) fileInputRef.current.value  = '';
    } catch (error) {
      console.error('Upload failed:', error);
     setErrors({ submit: 'Upload failed. Please try again.' });
    } finally {
     setIsLoading(false);
    }
  };

  const removeVideo = () => {
   setFormData(prev => ({ ...prev, video: null }));
   setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

   return (
   <div className="create-food-container">
       <div className="create-food-card">
         <h1 className="create-title">Upload New Food Video</h1>
         <p className="create-subtitle">Share your delicious food creation with the world</p>
        
    <form onSubmit={handleSubmit}>
      <div className="form-group">
       <label className="form-label" htmlFor="name">Title</label>
       <input
         id="name"
         name="name"
         type="text"
         className="form-input"
         placeholder="e.g. Delicious Butter Chicken"
         value={formData.name}
         onChange={handleInputChange}
         maxLength={100}
       />
        {errors.name && <span className="error-msg">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="form-textarea"
          placeholder="Describe your recipe, ingredients, and cooking tips..."
          value={formData.description}
          onChange={handleInputChange}
          maxLength={500}
        />
        {errors.description && <span className="error-msg">{errors.description}</span>}
       </div>

      <div className="form-group">
        <label className="form-label video-file-label" htmlFor="video">
<div className={`video-upload-area ${previewUrl ? 'has-video' : ''}`}>
          {previewUrl ? (
           <>
            <video src={previewUrl} controls muted playsInline />
            <button 
              type="button" 
              className="video-remove-btn"
              onClick={removeVideo}
            >
              ×
            </button>
           </>
            ) : (
              '📹 Upload Video'
            )}
           </div>
        </label>
        <input
          ref={fileInputRef}
          id="video"
          name="video"
          type="file"
          className="video-file-input"
          accept="video/*"
          onChange={handleVideoChange}
        />
          {errors.video && <span className="error-msg">{errors.video}</span>}
        </div>

      <button type="submit" className="submit-btn" disabled={isLoading}>
       {isLoading ? 'Uploading...' : 'Upload Food Video'}
      </button>

      {errors.submit && <span className="error-msg">{errors.submit}</span>}
     </form>
   </div>
   </div>
  );
};

export default CreateFood;

