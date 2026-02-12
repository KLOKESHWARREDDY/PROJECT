const Registration = require('../models/Registration');

// Student register for event
const registerEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registration = await Registration.create({
      event: eventId,
      student: req.user._id,
    });

    res.status(201).json(registration);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerEvent };
