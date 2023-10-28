import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faGlobe, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const MySprint = () => {
  const [lessonCards, setLessonCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const showInfoMessage = () => {
    setShowInfo(true);
  };

  const hideInfoMessage = () => {
    setShowInfo(false);
  };

  useEffect(() => {
    async function fetchLessonCards() {
      try {
        const response = await fetch('http://localhost:4000/lesson-cards', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setLessonCards(data);
          setIsLoading(false);
        } else {
          console.error('Failed to fetch lesson cards');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    }

    fetchLessonCards();
  }, []);

  const handlePlayClick = (card) => {
    setTimeout(() => {
      window.location.reload();
      setTimeout(() => {
        window.location.href = `/video/${card._id}`;
      }, 100);
    }, 100);
  };

  const handleDeleteClick = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:4000/lesson-cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setLessonCards((prevCards) => prevCards.filter((card) => card._id !== cardId));
      } else {
        console.error('Failed to delete the lesson card');
      }
      window.location.reload();
      toast.success('Deleted!!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="lesson-cards flex flex-wrap">
      {isLoading ? (
        <Loading />
      ) : (
        lessonCards.map((card, index) => (
          <div key={index} className="lesson-card p-4 border-2 border-black text-white rounded-3xl shadow-md w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mx-4 my-4 bg-black relative">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-fuchsia-700">{card.title}</h2>
              
            </div>
            <p className="card-description text-violet-500 font-mono mt-1">
              <span className="text-white">Description:</span> {card.description}
            </p>
            <p className="card-tag text-teal-500 font-mono">
              <span className="text-white">Tag(s):</span> {card.tag}
            </p>
            <p className="card-links text-yellow-400 font-mono">
              <span className="text-white">Link(s) Added:</span> {card.links.length}
            </p>
            <div className="flex items-center mt-4">
              <Link to={`/video/${card._id}`} onClick={() => handlePlayClick(card)} className="block px-4 py-2 text-white rounded-2xl hover:bg-green-900 border-2 border-green-500">
                Play
              </Link>
              <p className="absolute top-5 right-2 text-gray-400 border-2 px-2 rounded-2xl py-1 text-xs">
                {card.isPrivate ? (
                  <>
                    <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-400 text-xs" />
                    Private
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faGlobe} className="mr-2 text-gray-400 text-xs" />
                    Public
                  </>
                )}
              </p>
              <button onClick={() => handleDeleteClick(card._id)} className="ml-2 px-4 py-2 border-2 border-red-600 text-white hover:bg-red-900 rounded-2xl">
                Delete
              </button>
              <div className="flex info-icon-container ml-auto">
                <button className="info-icon" aria-label="Show information" onMouseEnter={() => showInfoMessage()} onMouseLeave={() => hideInfoMessage()}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                </button>
                {showInfo && (
                  <div className="info-message bg-white border-2 border-gray-400 p-2 text-sm text-gray-700 rounded-lg absolute right-0 mt-2">
                    You can edit any information, inside player. For that click play btn.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      <Toaster position="top-center" />
    </div>
  );
};

export default MySprint;