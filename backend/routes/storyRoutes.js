const express = require('express');
const router = express.Router();
const { createStory, getUserStories, deleteStory } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createStory).get(protect, getUserStories);
router.route('/:id').delete(protect, deleteStory);

module.exports = router;