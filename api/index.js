const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Add cookie-parser
const User =require('./models/User');
const LessonCard = require('./models/lessonCardModel');
// const Event = require('./models/EventModel');
const axios = require('axios');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer'); // Import multer
const path = require('path');
require('dotenv').config();

const app = express();

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://rare-sprints.vercel.app');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', true);

//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }

//   next();
// });

app.use(cors({
  origin: 'https://rare-sprints.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const PORT = process.env.PORT || 4000;
const apiKey = process.env.YT_API_KEY;
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Check cookies and headers
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
  
  // User Registration
  app.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });
  
  // User Login
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
  
      // Set the token as a cookie
      res.cookie('token', token, { httpOnly: true });
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // User Logout
app.post('/logout', (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    res.json('Logged out successfully');
  });

  app.get('/profile', verifyToken, async (req, res) => {
    console.log("profile path");
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
      console.log((user)+"hi");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve user information' });
    }
  });

  // Create a Lesson Card
app.post('/lesson-cards', verifyToken, async (req, res) => {
    try {
      const { title, description, tag, isPrivate, links } = req.body;
  
      const newLessonCard = new LessonCard({
        title,
        description,
        tag,
        isPrivate,
        links,
        userId: req.userId, // Include the user ID in the lesson card
      });
  
      await newLessonCard.save();
  
      res.status(201).json({ message: 'Lesson card created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create lesson card' });
    }
  });
  
  // Get Lesson Cards
  app.get('/lesson-cards', verifyToken, async (req, res) => {
    try {
      const lessonCards = await LessonCard.find({ userId: req.userId });
  
      res.json(lessonCards);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve lesson cards' });
    }
  });


  
  // Delete a Lesson Card
app.delete('/lesson-cards/:id', verifyToken, async (req, res) => {
  const cardId = req.params.id;

  try {
    // Find the lesson card based on cardId and the user's ID
    const lessonCard = await LessonCard.findOne({ _id: cardId, userId: req.userId });

    if (!lessonCard) {
      return res.status(404).json({ message: 'Lesson card not found' });
    }

    // Delete the lesson card
    await LessonCard.findByIdAndRemove(cardId);

    res.status(204).send(); // Respond with status 204 (No Content) indicating successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete the lesson card' });
  }
});

  // Add a new endpoint to retrieve card information by ID
  app.get('/lesson-cards/:id/info', verifyToken, async (req, res) => {
    const cardId = req.params.id;

    try {
      const cardInfo = await LessonCard.findOne({ _id: cardId, userId: req.userId });

      if (!cardInfo) {
        return res.status(404).json({ message: 'Lesson card not found' });
      }

      // Assuming you have fields like title, description, and tag in the lesson card document,
      // you can access them and send them in the response.
      const { title, description, tag } = cardInfo;
      res.json({ title, description, tag });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve card information' });
    }
  });

  // Get Links for a Lesson Card
app.get('/lesson-cards/:id', verifyToken, async (req, res) => {
    const cardId = req.params.id;
  
    try {
      const lessonCard = await LessonCard.findOne({ _id: cardId, userId: req.userId });
  
      if (!lessonCard) {
        return res.status(404).json({ message: 'Lesson card not found' });
      }
  
      // Assuming links are stored within the lesson card as an array, you can access them directly.
      const links = lessonCard.links;
      res.json(links);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve links' });
    }
  });
  

  // Add a new endpoint to update video titles in a lesson card
app.post('/lesson-cards/:id/update-video-title', verifyToken, async (req, res) => {
  const cardId = req.params.id;
  const { link, title } = req.body;

  try {
    // Find the lesson card based on cardId and the user's ID
    const lessonCard = await LessonCard.findOne({ _id: cardId, userId: req.userId });

    if (!lessonCard) {
      return res.status(404).json({ message: 'Lesson card not found' });
    }

    // Find the video link within the lesson card's links array and update its title
    const videoLinkToUpdate = lessonCard.links.find((video) => video.link === link);
    if (videoLinkToUpdate) {
      videoLinkToUpdate.title = title;
    } else {
      return res.status(404).json({ message: 'Video link not found in the lesson card' });
    }

    // Save the updated lesson card
    await lessonCard.save();

    res.status(200).json({ message: 'Video title updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update the video title' });
  }
});

  // Create a route to save edits to a lesson card
app.post('/lesson-cards/:id/update-details', verifyToken, async (req, res) => {
  const cardId = req.params.id;
  const { title, description, tag } = req.body;

  try {
    // Find the lesson card based on cardId and the user's ID
    const lessonCard = await LessonCard.findOne({ _id: cardId, userId: req.userId });

    if (!lessonCard) {
      return res.status(404).json({ message: 'Lesson card not found' });
    }

    // Update the lesson card's information
    lessonCard.title = title;
    lessonCard.description = description;
    lessonCard.tag = tag;

    // Save the updated lesson card
    await lessonCard.save();

    res.status(200).json({ message: 'Edits saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save edits' });
  }
});

  //link adding in "video" component
  app.post('/lesson-cards/:id/add-link', verifyToken, async (req, res) => {
    const cardId = req.params.id;
    const { title, link, note } = req.body;
  
    try {
      // Find the lesson card based on cardId and the user's ID
      const lessonCard = await LessonCard.findOne({ _id: cardId, userId: req.userId });
  
      if (!lessonCard) {
        return res.status(404).json({ message: 'Lesson card not found' });
      }
  
      // Add the new link to the lesson card's links array
      lessonCard.links.push({ title, link, note });
  
      // Save the updated lesson card
      await lessonCard.save();
  
      res.status(200).json({ message: 'Link added to the lesson card successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add a link to the lesson card' });
    }
  });
  
  app.post('/lesson-cards/:id/mark-link', verifyToken, async (req, res) => {
    const cardId = req.params.id;
    const { link, isMarked } = req.body; // You should send the link and isMarked from the frontend.
  
    try {
      // Find the lesson card based on cardId and the user's ID
      const lessonCard = await LessonCard.findOne({ _id: cardId, userId: req.userId });
  
      if (!lessonCard) {
        return res.status(404).json({ message: 'Lesson card not found' });
      }
  
      // Find the link within the lesson card's links array and update its isMarked property
      const linkToUpdate = lessonCard.links.find((l) => l.link === link);
      if (linkToUpdate) {
        linkToUpdate.isMarked = isMarked; // Update the isMarked property
      } else {
        return res.status(404).json({ message: 'Link not found in the lesson card' });
      }
  
      // Save the updated lesson card
      await lessonCard.save();
  
      res.status(200).json({ message: 'isMarked property updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update the isMarked property' });
    }
  });
  
  // Delete a link and associated notes
app.delete('/lesson-cards/:id/delete-link', verifyToken, async (req, res) => {
  const cardId = req.params.id;
  const { link } = req.body;

  try {
    // Find the lesson card based on cardId and the user's ID
    const lessonCard = await LessonCard.findOne({ _id: cardId, userId: req.userId });

    if (!lessonCard) {
      return res.status(404).json({ message: 'Lesson card not found' });
    }

    // Find the index of the link to be deleted
    const linkIndex = lessonCard.links.findIndex((l) => l.link === link);
    if (linkIndex !== -1) {
      // Remove the link and its associated notes
      lessonCard.links.splice(linkIndex, 1);

      // Save the updated lesson card
      await lessonCard.save();

      res.status(204).send(); // Respond with status 204 (No Content) indicating successful deletion
    } else {
      return res.status(404).json({ message: 'Link not found in the lesson card' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete the link and associated notes' });
  }
});


  //notes adding/updating/editing in video component
  app.post('/lesson-cards/:id/update-note', verifyToken, async (req, res) => {
    const cardId = req.params.id;
    const { link, note } = req.body;
  
    try {
      // Find the lesson card based on cardId and the user's ID
      const lessonCard = await LessonCard.findOne({ _id: cardId, userId: req.userId });
  
      if (!lessonCard) {
        return res.status(404).json({ message: 'Lesson card not found' });
      }
  
      // Find the link within the lesson card's links array and update its note
      const linkToUpdate = lessonCard.links.find((l) => l.link === link);
      if (linkToUpdate) {
        linkToUpdate.note = note;
      } else {
        return res.status(404).json({ message: 'Link not found in the lesson card' });
      }
  
      // Save the updated lesson card
      await lessonCard.save();
  
      res.status(200).json({ message: 'Note for the link updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update the note for the link' });
    }
  });


// for embeding yt-playlist and extrac all video links & titles
  app.post('/fetchPlaylistVideos', async (req, res) => {
    const { playlistLink } = req.body;
  
    try {
      const playlistId = getPlaylistId(playlistLink);
      const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
      let nextPageToken = null;
      const videoData = [];
  
      do {
        const response = await axios.get(apiUrl + (nextPageToken ? `&pageToken=${nextPageToken}` : ''));
        const { items, nextPageToken: nextPage } = response.data;
  
        items.forEach((item) => {
          const videoId = item.snippet.resourceId.videoId;
          const videoTitle = item.snippet.title;
          const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
          videoData.push({ title: videoTitle, link: videoLink });
        });
  
        nextPageToken = nextPage;
      } while (nextPageToken);
  
      res.status(200).json(videoData);
    } catch (error) {
      console.error('Error fetching playlist videos:', error.message);
      res.status(500).json({ error: 'Failed to fetch playlist videos' });
    }
  });
  
  function getPlaylistId(playlistUrl) {
    const regex = /list=([A-Za-z0-9_\-]+)/;
    const match = playlistUrl.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error('Invalid playlist URL');
  }

//PORT declaration
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
