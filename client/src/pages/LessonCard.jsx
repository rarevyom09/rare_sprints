import React, { useState } from 'react';
import { FaLock, FaUnlock } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const LessonCard = () => {
  const token = localStorage.getItem('token');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [usePlaylist, setUsePlaylist] = useState(false);
  const [links, setLinks] = useState([]);
  const [linkTitle, setLinkTitle] = useState('');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [playlistLink, setPlaylistLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [videosFetched, setVideosFetched] = useState(false); // Add videosFetched state

  const addLink = () => {
    const newLink = { title: linkTitle, link, note };
    setLinks([...links, newLink]);
    setLinkTitle('');
    setLink('');
    setNote('');
  };

  const removeLink = (index) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };

  const createLessonCard = async () => {
    setLoading(true);

    const lessonCardData = {
      title,
      description,
      tag,
      isPrivate,
      playlistLink,
      links,
    };
    try {
      const response = await fetch('https://sprintsbyvyompadalia.vercel.app/lesson-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(lessonCardData),
      });
      if (response.status === 201) {
        setTitle('');
        setDescription('');
        setTag('');
        setIsPrivate(false);
        setLinks([]);
        setPlaylistLink('');
        setVideosFetched(false); // Reset videosFetched state
        window.location.href = '/mysprint';
      } else {
        // Handle any errors here
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylistVideos = async () => {
    setLoading(true);

    try {
      const response = await fetch('https://sprintsbyvyompadalia.vercel.app/fetchPlaylistVideos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistLink }),
      });

      if (response.status === 200) {

        const playlistData = await response.json();

        const videoLinks = playlistData.map((video) => ({
          title: video.title,
          link: video.link,
          note: '',
        }));

        setLinks(videoLinks);
        setVideosFetched(true); // Set videosFetched to true
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={require("../images/inf2.png")}
                    alt="logo"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Requested playlist Embeded successfully!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Now fill rest details and Create your Sprint.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ))
      } else {
        // Handle any errors when fetching videos from the playlist
      }
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-1/2 justify-center items-center mx-auto my-auto">
      <h2 className="text-2xl font-semibold mb-4">Create your Sprint</h2>

      <div className="mb-4">
        <label className="block text-gray-600 font-semibold">Use YouTube Playlist</label>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={usePlaylist}
            onChange={() => setUsePlaylist(!usePlaylist)}
            className="mr-2"
          />
          <span className="text-black flex items-center">Use YouTube Playlist</span>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-600 font-semibold">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      {usePlaylist && !videosFetched ? (
        loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mb-4">
            <label htmlFor="playlistLink" className="block text-gray-600 font-semibold">
              YouTube Playlist Link
            </label>
            <input
              type="text"
              id="playlistLink"
              value={playlistLink}
              onChange={(e) => setPlaylistLink(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button onClick={fetchPlaylistVideos} className="bg-black text-white rounded-3xl p-2 m-2">Embed this Playlist</button>
          </div>
        )
      ) : null}
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-600 font-semibold">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='You can edit it in the future'
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="tag" className="block text-gray-600 font-semibold">Tag</label>
        <input
          type="text"
          id="tag"
          value={tag}
          placeholder='tag1, tag2, tag3 (comma-separated tags) - You can edit it in the future'
          onChange={(e) => setTag(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 font-semibold">Privacy</label>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
            className="mr-2"
          />
          {isPrivate ? (
            <span className="text-red-500 flex items-center">
              <FaLock className="mr-2" />
              Private
            </span>
          ) : (
            <span className="text-green-500 flex items-center">
              <FaUnlock className="mr-2" />
              Public
            </span>
          )}
        </div>
      </div>

      <button
          onClick={createLessonCard}
          className="w-full bg-black text-white rounded-3xl p-2 hover-bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          type="button"
        >
          {loading ? 'Creating...' : 'Submit'}
      </button>
      <Toaster 
        position="top-center"
      />
    </div>
  );
};

export default LessonCard;
