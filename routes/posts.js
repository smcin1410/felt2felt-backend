const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our authentication middleware
const Post = require('../models/Post');
const User = require('../models/user');

// --- Helper function to update user points and rank ---
const updateUserPoints = async (userId, pointsToAdd) => {
    const user = await User.findById(userId);
    if (!user) return;

    user.points += pointsToAdd;

    // Determine new rank based on points
    if (user.points >= 5000) {
        user.rank = 'Legend';
    } else if (user.points >= 1500) {
        user.rank = 'High Roller';
    } else if (user.points >= 500) {
        user.rank = 'Grinder';
    } else if (user.points >= 100) {
        user.rank = 'Regular';
    }

    await user.save();
};


// @route   GET api/posts
// @desc    Get all forum posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts
// @desc    Create a new forum post
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, content, city } = req.body;

  if (!title || !content) {
    return res.status(400).json({ msg: 'Please include a title and content.' });
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ msg: 'User not found.' });
    }

    const newPost = new Post({
      title,
      content,
      city,
      user: req.user.id,
      authorEmail: user.email,
      // NEW: Store the author's rank at the time of posting
      authorRank: user.rank 
    });

    const post = await newPost.save();

    // NEW: Award points for creating a post
    await updateUserPoints(req.user.id, 10);

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', auth, async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ msg: 'Comment text is required.' });
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const newComment = {
            user: req.user.id,
            authorEmail: user.email,
            text: text,
            // NEW: Store the author's rank at the time of commenting
            authorRank: user.rank
        };

        post.comments.unshift(newComment);
        await post.save();
        
        // NEW: Award points for creating a comment
        await updateUserPoints(req.user.id, 2);

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
