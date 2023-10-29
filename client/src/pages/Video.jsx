import React, { useState, useEffect,useRef } from 'react';
import YouTube from 'react-youtube';
import getYouTubeID from 'get-youtube-id';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus, faSave, faTimes , faInfoCircle, faCaretDown,faCaretUp ,faEllipsisV, faCaretRight, faCaretLeft, faRemove, faNoteSticky, faPause } from '@fortawesome/free-solid-svg-icons';
import Loading from '../components/Loading';
import toast, { Toaster } from 'react-hot-toast';
// import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import './Video.css';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const cardId = window.location.pathname.split('/').pop();

const YouTubeEmbed = ({ videoUrl }) => {
  const videoId = getYouTubeID(videoUrl);

  const opts = {
    height: '360',
    width: '650',
    playerVars: {
      autoplay: 0,
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
  const [videoItems, setVideoItems] = useState([]);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [completedVideos, setCompletedVideos] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const [cardInfo, setCardInfo] = useState({ title: '', description: '', tag: '' });
  const [isAddVideoOpen, setAddVideoOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [editedVideoTitles, setEditedVideoTitles] = useState({});
  const [showInfo, setShowInfo] = useState(false);

  const exportToPDF = () => {
    const content = [];
    content.push({ text: `sprint(s)_${cardInfo.title}_my_notes`, fontSize: 16, bold: true, margin: [0, 0, 0, 10] });
  
    const titleStyle = { fontSize: 14, bold: true, color: 'red' };
    const linkStyle = { fontSize: 12, color: 'blue', decoration: 'underline' };
    const noteStyle = { fontSize: 12, color: 'black' };
    const ribbonStyle={alignment:'center',color:'orange',bold:true};
    // Iterate through videoItems and add links and notes to the PDF
    if (Array.isArray(videoItems)) {
      videoItems.forEach((item) => {
        const itemContent = [];
        itemContent.push({ text: `Title: ${item.title}`, fontSize: 20, bold: true ,margin: [0, 20],style:titleStyle});
        itemContent.push({ text: `Link: ${item.link}`, fontSize: 10,italics:true,margin:[0,10],link: item.link, style: linkStyle  });
        if (item.note) {
          itemContent.push({ text: `Note: ${item.note}`, fontSize: 12 ,style:noteStyle});
        }
        itemContent.push({
          text: '\u00A9 2023 Sprint(s) by Vyom Padalia & RARE. All rights reserved.',
          fontSize: 9,
          margin: [0, 10],
          style: ribbonStyle,
        });        
        content.push(itemContent);
      });
    }
  
    const documentDefinition = {
      content,
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60], // Adjust margins as needed
    };
  
    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.download(`${cardInfo.title}_sprint_NOTES.pdf`);
  };
  
  
  
  
  const showInfoMessage = () => {
    setShowInfo(true);
  };

  const hideInfoMessage = () => {
    setShowInfo(false);
  };

  const handleVideoTitleEdit = (e, url) => {
    setEditedVideoTitles({
      ...editedVideoTitles,
      [url]: e.target.innerHTML,
    });
  };

  const handleTitleSave = async (url) => {
    const editedTitle = editedVideoTitles[url];
  
    try {
      const response = await fetch(`http://localhost:4000/lesson-cards/${cardId}/update-video-title`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: url, title: editedTitle }),
      });
  
      if (response.status === 200) {
        toast.success('Title saved successfully!');
      } else {
        console.error('Failed to save the title');
        toast.error('Failed to save title');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handlePlayClick = (url) => {
    if (selectedUrl === url) {
      setIsPlaying(!isPlaying); // Toggle playback status
    } else {
      setIsPlaying(true); // Start playing the new video
    }
    setSelectedUrl(url);
  };

  const handleTitleEdit = (e) => {
    setCardInfo({ ...cardInfo, title: e.target.innerHTML });
  };
  
  const handleDescriptionEdit = (e) => {
    setCardInfo({ ...cardInfo, description: e.target.innerHTML });
  };
  
  const handleTagsEdit = (e) => {
    setCardInfo({ ...cardInfo, tag: e.target.innerText });
  };
  
  const saveEdits = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/lesson-cards/${cardId}/update-details`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardInfo),
      });

      if (response.status === 200) {
        toast.success('Edits saved successfully!');
      } else {
        console.error('Failed to save edits');
        toast.error('Failed to save edits');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTitleChange = (e) => {
    setCurrentTitle(e.target.value);
  };

  const handleUrlChange = (e) => {
    setCurrentUrl(e.target.value);
  };

  const openPopover = (url) => {
    const video = videoItems.find((item) => item.link === url);
    if (video) {
      setPopoverOpen(true);
      setEditedNote(video.note || '');
      setSelectedUrl(url);
    }
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  const saveNote = async () => {
    if (selectedUrl) {
      const updatedVideos = videoItems.map((item) => {
        if (item.link === selectedUrl) {
          return { ...item, note: editedNote };
        }
        return item;
      });

      setVideoItems(updatedVideos);
      setPopoverOpen(false);

      try {
        const response = await fetch(`http://localhost:4000/lesson-cards/${cardId}/update-note`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ link: selectedUrl, note: editedNote }),
        });

        if (response.status === 200) {
          toast.success('Note saved successfully!');
        } else {
          console.error('Failed to update the note for the video');
          toast.error('Failed to update note');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const addVideo = async () => {
    if (currentTitle && currentUrl) {
      setLoading(true);
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
          if (Array.isArray(updatedLinks)) {
            setVideoItems(updatedLinks);
          }
          setCurrentTitle('');
          setCurrentUrl('');
          toast.success('Video added successfully!');
          window.location.reload();
        } else {
          console.error('Failed to add a new video to the lesson card');
          toast.error('Failed to add video');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderTags = (tags) => {
    if (!tags) return null;
    const tagList = tags.split(',').map((tag, index) => {
      return (
        <span
          key={index}
          className="bg-zinc-400 px-2 rounded-xl text-sm font-semibold mr-2 border-2 border-black"
        >
          #{tag.trim()}
        </span>
      );
    });

    return tagList;
  };

  const deleteVideo = (url) => {
    if (url) {
      const confirmed = window.confirm('Are you sure you want to delete this video?');
  
      if (confirmed) {
        fetch(`http://localhost:4000/lesson-cards/${cardId}/delete-link`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ link: url }),
        })
          .then((response) => {
            if (response.status === 204) {
              const updatedVideos = videoItems.filter((item) => item.link !== url);
              setVideoItems(updatedVideos);
              toast.success('Video deleted successfully!');
            } else if (response.status === 404) {
              console.error('Video not found or already deleted.');
              toast.error('Video not found or already deleted.');
            } else {
              console.error('Failed to delete the video');
              toast.error('Failed to delete video');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
  };
  

  const playVideo = (url) => {
    setSelectedUrl(url);
  };

  const markVideoCompleted = async (url) => {
    if (Array.isArray(videoItems)) {
      const updatedVideos = videoItems.map((item) => {
        if (item.link === url) {
          const updatedItem = { ...item, completed: !item.completed, isMarked: !item.isMarked };

          fetch(`http://localhost:4000/lesson-cards/${cardId}/mark-link`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ link: url, isMarked: updatedItem.isMarked }),
          })
            .then((response) => {
              if (response.status === 200) {
                console.log('isMarked property updated successfully');
                toast.success('Status updated');
              } else {
                console.error('Failed to update the isMarked property');
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });

          return updatedItem;
        }
        return item;
      });
      setVideoItems(updatedVideos);
    }
  };

  useEffect(() => {
    async function fetchLinks() {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/lesson-cards/${cardId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setVideoItems(data);
          } else {
            console.error('Response data is not an array:', data);
          }
        } else {
          console.error('Failed to fetch links. Status:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, [cardId]);

  useEffect(() => {
    if (Array.isArray(videoItems)) {
      const markedVideosCount = videoItems.filter((item) => item.isMarked).length;
      const progress = (markedVideosCount / videoItems.length) * 100;
      setVideoProgress(progress);

      const completedVideosCount = videoItems.filter((item) => item.completed).length;
      setCompletedVideos(completedVideosCount);
    }
  }, [videoItems]);

  useEffect(() => {
    async function fetchCardInfo() {
      try {
        const response = await fetch(`http://localhost:4000/lesson-cards/${cardId}/info`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setCardInfo(data);
        } else {
          console.error('Failed to fetch card information');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchCardInfo();
  }, [cardId]);

  return (
    <div style={{ display: 'flex', margin: '20px' }}>
      <YouTubeEmbed videoUrl={selectedUrl} />

      <div style={{ flex: '1', padding: '1rem', border: '2px solid black' }} className="input-container">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-4 text-purple-900" contentEditable onBlur={handleTitleEdit} suppressContentEditableWarning={true}>{cardInfo.title}</h1>
          <div class="info-icon-container">
            <button
              class="info-icon"
              aria-label="Show information"
              onMouseEnter={() => showInfoMessage()}
              onMouseLeave={() => hideInfoMessage()}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
            <div class="info-message">Click any text field to edit it, then click its save icon to save your changes. For any changes you made wait for success notification.</div>
          </div>
        </div>
        <hr className="border-1 border-black" />
        <p className="text-xl font-semibold mb-2 text-blue-900" contentEditable onBlur={handleDescriptionEdit} suppressContentEditableWarning={true}>{cardInfo.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Tags:</p>
          <div class="info-icon-container">
              <button
                class="info-icon"
                aria-label="Show information"
                onMouseEnter={() => showInfoMessage()}
                onMouseLeave={() => hideInfoMessage()}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
              <div class="info-message text-orange-600">Write tags as comma seperated words.</div>
          </div>
        </div>
        <div
          className="tags text-sm font-semibold mb-2 text-blue-400"
          contentEditable
          onBlur={handleTagsEdit}
          suppressContentEditableWarning={true}
        >
        {cardInfo.tag}
        </div>
        <div className="flex justify-between">
          <button onClick={saveEdits} className="flex items-center justify-center mt-2 px-2 py-1 bg-black text-white rounded-full">
            <FontAwesomeIcon icon={faSave}  className="flex items-center justify-center mr-1 text-xs"/>Save (Title,Desc,Tags)
          </button>
        
          <button onClick={exportToPDF} className="bg-black text-white px-2 rounded-3xl">
            Export to PDF
          </button>
        </div>
        <hr className="border-1 border-black mt-2" />
        <p className="text-sm font-semibold mb-2">Progress:</p>
        <div className="progress-bar">
          <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-2">
            <div
              className="bgmain text-sm font-bold text-white text-center p-0.5 leading-none rounded-full border-2 border-black"
              style={{ width: `${videoProgress}%` }}
            >
              {videoProgress.toFixed(2)}%
            </div>
          </div>
        </div>
        <hr className="border-1 border-black mt-2" />
        {loading ? (
          <Loading />
        ) : (
          <div>
          <button
            onClick={() => setAddVideoOpen(!isAddVideoOpen)}
            className="mt-2 px-2 py-1 bg-black text-white rounded-full"
          >
            {isAddVideoOpen ? (
        <>
          <FontAwesomeIcon icon={faCaretUp} /> Hide
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faCaretDown} /> Add Videos
        </>
        )}
          </button>
          

          {isAddVideoOpen && (
            <div className='addvideo bg-black px-3 py-2 rounded-3xl mt-2 text-white'>
              {/* <p>Add Videos</p> */}
              <label className="block mb-2">Enter a video title:</label>
            <input
              type="text"
              value={currentTitle}
              onChange={handleTitleChange}
              placeholder="Enter video title"
              className="w-full p-2 border rounded-2xl input-field text-black"
            />
            <label className="block mt-2 mb-2 ">Enter a YouTube URL:</label>
            <input
              type="text"
              value={currentUrl}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID_HERE"
              className="w-full p-2 border rounded-2xl input-field text-black"
            />
            <button onClick={addVideo} className="mt-2 p-2 bg-blue-500 text-white rounded-2xl">
              <FontAwesomeIcon icon={faPlus} /> Add
            </button>
            {/* <hr className="border-1 border-black mt-2" /> */}
            </div>
          )}
          </div>
        )}
        <div className="mt-4">
          {Array.isArray(videoItems) && videoItems.map((item, index) => (
            <div
              key={index}
              className={`mb-2 flex items-center ${
                item.isMarked ? 'bg-green-200 rounded-full' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <button
                onClick={() => handlePlayClick(item.link)}
                className="bg-black text-white text-lg rounded-full px-3 py-1"
              >
                <FontAwesomeIcon icon={isPlaying && selectedUrl === item.link ? faPause : faPlay} />
              </button>
              <p
                className="link-title text-lg font-medium"
                contentEditable
                onBlur={(e) => handleVideoTitleEdit(e, item.link)}
                suppressContentEditableWarning={true}
              >
                {editedVideoTitles[item.link] || item.title}
              </p>
              </div>
              <div className="ml-auto relative">
              <button
                onClick={() => handleTitleSave(item.link)}
                className="text-blue-500 text-xs hover:bg-blue-100 px-2 rounded-xl border-2 border-blue-600 mr-2"
              >
                <FontAwesomeIcon icon={faSave} className="mr-1" />
                
              </button>
                <button
                  onClick={() => {
                    setMenuOpen((prevMenuOpen) => ({
                      ...prevMenuOpen,
                      [item.link]: !prevMenuOpen[item.link],
                    }));
                  }}
                  className="px-3"
                >
                  <FontAwesomeIcon icon={isMenuOpen[item.link] ? faCaretUp : faCaretDown} />
                </button>
                {isMenuOpen[item.link] && (
                  <div className="absolute right-0 mt-2 bg-black rounded-xl shadow-md text-sm z-10 p-3">
                    <button
                      onClick={() => openPopover(item.link)}
                      className="px-2 py-1 text-blue-500 hover:bg-blue-100 w-full text-center rounded-xl border-2 border-blue-600 mb-2"
                    >
                    <FontAwesomeIcon icon={faNoteSticky} className="mr-1" />
                      Notes
                    </button>

                    <button
                      onClick={() => deleteVideo(item.link)}
                      className="flex px-2 py-1 text-red-500 hover:bg-red-300 hover:text-black w-full text-left items-center rounded-xl border-2 border-red-600 mb-2"
                    >
                      <FontAwesomeIcon icon={faRemove} className="mr-1" />Remove
                    </button>

                    <div className="flex items-center bg-transparent border-2 border-green-400 rounded-xl hover:bg-green-100 hover:text-black">
                    <label className="flex items-center cursor-pointer px-2 py-1">
                      <input
                        type="checkbox"
                        checked={item.isMarked}
                        onChange={() => markVideoCompleted(item.link)}
                        className="form-checkbox h-5 w-5 text-green-600 rounded-full transition duration-200 ease-in-out"
                      />
                      <p className="text-black font-medium ml-2">done?</p>
                    </label>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
      {isPopoverOpen && (
        <div className="modal">
          <textarea
            rows="10"
            cols="100"
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
            placeholder="Enter your notes here..."
            className='bg-white rounded-2xl p-2 border-2 border-black'
          />
          <div className="buttons-container">
            <button onClick={saveNote} className="btn-save bg-black text-white text-lg p-2 rounded-xl mr-2">Save</button>
            <button onClick={closePopover} className="btn-close bg-black text-white text-lg p-2 rounded-xl mr-2">Close</button>
          </div>
        </div>
      )}
      
      <Toaster 
        position="top-center"
      />
    </div>
  );
};

export default Video;
