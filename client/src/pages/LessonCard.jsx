import React, { useState, useEffect } from 'react';
import { FaLink, FaTrash, FaLock, FaUnlock } from 'react-icons/fa';

const LessonCard = () => {
  const token = localStorage.getItem('token');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [links, setLinks] = useState([]);
  const [linkTitle, setLinkTitle] = useState('');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');

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
    const lessonCardData = {
      title,
      description,
      tag,
      isPrivate,
      links,
    };
    try {
      const response = await fetch('https://sprintsbyvyompadalia-rarevyom09.vercel.app/lesson-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(lessonCardData),
      });
      if (response.status === 201) {
        // Lesson card created successfully
        setTitle('');
        setDescription('');
        setTag('');
        setIsPrivate(false);
        setLinks([]);
        // You can optionally handle the response here or perform a redirect
        window.location.href = '/mysprint';
      } else {
        // Handle any errors here
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className=" bg-white rounded-lg shadow-md p-6 w-1/2 justify-center items-center mx-auto my-auto">
      <h2 className="text-2xl font-semibold mb-4">Create your Sprint</h2>

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

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-600 font-semibold">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='{you can edit it future}'
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="tag" className="block text-gray-600 font-semibold">Tag</label>
        <input
          type="text"
          id="tag"
          value={tag}
          placeholder='tag1,tag2,tag3,comma seperated tags {you can edit it future}'
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
        className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Create Sprint
      </button>
    </div>
  );
};

export default LessonCard;
