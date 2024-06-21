import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './upload.css';


const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
    fetchVideos(); 
  }, []); 


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

    const handleUpload = async () => {
       console.log("Inside handle upload function **");
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);
      console.log("Inside handle upload function");
    try {
      const response = await axios.post('http://localhost:9000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
        alert('File uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
   finally {
       
         window.location.reload();
    }
    };
    
   const fetchVideos = async () => {
    try {
        const response = await axios.get('http://localhost:9000/upload'); 
        console.log(response.data)
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  return (
    <div className='fulldiv'>
     <div className="upload-container">
      <div className="upload-box">
        <h2>Upload Video</h2>
              <input type="file" onChange={handleFileChange} accept="video/*" />
              <br />
              <br />
              <button onClick={handleUpload}>Upload</button>
          </div>
          <br />
          <br />
        <br />
      </div>
      
      <div className="video-list">
      {videos.length === 0 ? (
        <p>No videos available</p>
      ) : (
        videos.map((video, index) => (
          <div key={index} className="video-item">
            <h3>Video {index + 1}</h3>
            <video controls width={400} height={400}>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))
      )}
    </div>
          
          

    </div>
  );
};

export default Upload;
