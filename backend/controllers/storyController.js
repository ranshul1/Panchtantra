const Story = require('../models/Story');

const createStory = async (req, res) => {
  const { topic, content } = req.body;

  try {
    const story = await Story.create({
      user: req.user._id,
      topic,
      content,
    });

    res.status(201).json(story);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserStories = async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await story.remove();
    res.json({ message: 'Story removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createStory, getUserStories, deleteStory };