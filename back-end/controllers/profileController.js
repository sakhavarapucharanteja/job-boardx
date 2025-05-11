const Profile = require('../models/Profile');

// GET /api/profile/me
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile
      .findOne({ user: req.user.id })
      .populate('user', ['name', 'email']);
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  const { bio, skills, resume, experience } = req.body;
  const skillsArr = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : [];
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      // update existing
      profile.bio        = bio;
      profile.skills     = skillsArr;
      profile.resume     = resume;
      profile.experience = experience;
      await profile.save();
      return res.json(profile);
    }
    // create new
    profile = new Profile({
      user: req.user.id,
      bio,
      skills: skillsArr,
      resume,
      experience
    });
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
