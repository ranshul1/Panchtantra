const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.sex = req.body.sex || user.sex;
      user.age = req.body.age || user.age;
      user.education = req.body.education || user.education;
      user.bio = req.body.bio || user.bio;
      user.iqScore = req.body.iqScore || user.iqScore;
      user.mentalAgeGroup = req.body.mentalAgeGroup || user.mentalAgeGroup;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        sex: updatedUser.sex,
        age: updatedUser.age,
        education: updatedUser.education,
        bio: updatedUser.bio,
        iqScore: updatedUser.iqScore,
        mentalAgeGroup: updatedUser.mentalAgeGroup,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserProfile, updateUserProfile };
