const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// ✅ Create Event
router.post('/create', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating event' });
  }
});

// ✅ Get Events by User
router.get('/user/:id', async (req, res) => {
  try {
    const events = await Event.find({ userId: req.params.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// ✅ Get All Events (for all users)
router.get('/all', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all events' });
  }
});

router.get('/events', async (req, res) => {
    const userId = req.query.userId;
    const events = await Event.find({
      $or: [
        { visibility: 'public' },
        { userId: userId }
      ]
    });
    res.json(events);
  });

// ✅ Get Event Details
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event details' });
  }
});

// ✅ Invite (add email to attendees)
router.post('/invite/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const { email } = req.body;
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (!event.attendees.includes(email)) {
      event.attendees.push(email);
      await event.save();
    }

    res.json({ success: true, message: 'Invitation added' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error inviting user' });
  }
});

// ✅ Join Event (by userId or user email)
router.post('/join/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const { userId } = req.body;

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      await event.save();
    }

    res.json({ success: true, message: 'You have joined the event' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error joining event' });
  }
});

// ✅ Check-in
router.post('/checkin', async (req, res) => {
  const { eventId, email } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.attendees.includes(email)) {
      res.json({ success: true, message: 'Check-in successful' });
    } else {
      res.json({ success: false, message: 'Not invited' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error during check-in' });
  }
});

module.exports = router;
