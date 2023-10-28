import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import getYouTubeID from 'get-youtube-id';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import Loading from './Loading';
import './Video.css';

const url = window.location.pathname;
const cardId = url.split('/').pop(); // Assuming the card ID is the last part of the URL.

const YouTubeEmbed = ({ videoUrl }) => {
  const videoId = getYouTubeID(videoUrl);

  const opts = {
    height: '360',
    width: '650',
    playerVars: {
      autoplay: 1,
    }
  };

  return (
    <div style={{ flex: '2' }}>
      <div className="video-container">
        <YouTube videoId={videoId} opts={opts} className="video-player" />
      </div>
    </div>
  );
};

const Video = () => {
  const [videoItems, setVideoItems] = useState([]); // Initialize as an empty array
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [completedVideos, setCompletedVideos] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleTitleChange = (e) => {
    setCurrentTitle(e.target.value);
  };

  const handleUrlChange = (e) => {
    setCurrentUrl(e.target.value);
  };

  const addVideo = async () => {
    if (currentTitle && currentUrl) {
      setLoading(true); // Set loading to true when adding a video
      const newVideo = { title: currentTitle, link: currentUrl, note: '', completed: false };

      try {
        const response = await fetch(`http://localhost:4000/lesson-cards/${cardId}/add-link`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newVideo),
        });

        if (response.status === 200) {
          const updatedLinks = await response.json();
          // Make sure videoItems is an array before updating
          if (Array.isArray(updatedLinks)) {
            setVideoItems(updatedLinks);
          }
          setCurrentTitle('');
          setCurrentUrl('');

          // Reload the page after adding a link
          window.location.reload();
        } else {
          console.error('Failed to add a new video to the lesson card');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false); // Set loading to false after adding the video
      }
    }
  };

  const playVideo = (url) => {
    setSelectedUrl(url);
  };

  const markVideoCompleted = (url) => {
    if (Array.isArray(videoItems)) {
      const updatedVideos = videoItems.map((item) => {
        if (item.link === url) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });
      setVideoItems(updatedVideos);
    }
  };

  useEffect(() => {
    async function fetchLinks() {
      setLoading(true); // Set loading to true when fetching links
      try {
        const response = await fetch(`http://localhost:4000/lesson-cards/${cardId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          // Make sure data is an array before setting it
          if (Array.isArray(data)) {
            setVideoItems(data);
          }
        } else {
          console.error('Failed to fetch links');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching links
      }
    }

    fetchLinks();
  }, [cardId]);

  useEffect(() => {
    if (Array.isArray(videoItems)) {
      const completedVideosCount = videoItems.filter((item) => item.completed).length;
      const totalVideosCount = videoItems.length;
      const progress = (completedVideosCount / totalVideosCount) * 100;
      setCompletedVideos(completedVideosCount);
      setVideoProgress(progress);
    }
  }, [videoItems]);

  return (
    <div style={{ display: 'flex', margin: '20px' }}>
      <YouTubeEmbed videoUrl={selectedUrl} />
      
      <div style={{ flex: '1', padding: '1rem', border: '2px solid black' }} className="input-container">
        <h1 className="text-2xl font-bold mb-4">Track RARE</h1>
        {loading ? ( // Show loading spinner while adding a video
          <Loading />
        ) : (
          <div>
            <label className="block mb-2">Enter a video title:</label>
            <input
              type="text"
              value={currentTitle}
              onChange={handleTitleChange}
              placeholder="Enter video title"
              className="w-full p-2 border rounded input-field"
            />
            <label className="block mt-2 mb-2">Enter a YouTube URL:</label>
            <input
              type="text"
              value={currentUrl}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID_HERE"
              className="w-full p-2 border rounded input-field"
            />
            <button onClick={addVideo} className="mt-2 p-2 bg-blue-500 text-white rounded">
              <FontAwesomeIcon icon={faPlus} /> Add
            </button>
          </div>
        )}
        <div className="mt-4">
          {Array.isArray(videoItems) && videoItems.map((item, index) => (
            <div key={index} className="mb-2 flex items-center">
              <button
                onClick={() => playVideo(item.link)}
                className="p-2 bg-green-500 text-white rounded mr-2"
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
              {item.title}
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => markVideoCompleted(item.link)}
              />
            </div>
          ))}
        </div>
        <div className="progress-bar">
          {completedVideos} / {Array.isArray(videoItems) ? videoItems.length : 0} Videos Completed
          <div
            className="progress"
            style={{ width: `${videoProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Video;
