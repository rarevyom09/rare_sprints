const mongoose = require('mongoose');
const lessonCardSchema = new mongoose.Schema({
  title: String,
  description: String,
  tag: String,
  isPrivate: Boolean,
  playlistLink: String,
  links: [
    {
      title: String,
      link: String,
      note: String,
      isMarked: { type: Boolean, default: false },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model (if you have one)
    required: true, // Make sure a userId is always provided
  },
});

const LessonCard = mongoose.model('LessonCard', lessonCardSchema);

module.exports = LessonCard;
