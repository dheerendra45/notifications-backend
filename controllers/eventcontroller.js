const Event = require('../model/event.js');

// Get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizerId', 'name email'); // Populate organizer details if needed
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({ message: 'Failed to fetch events. Please try again later.' });
    }
};

// Get events for the logged-in user
const getUserEvents = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming middleware sets `req.user` after token verification
        const events = await Event.find({ organizerId: userId });
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching user events:', error.message);
        res.status(500).json({ message: 'Failed to fetch your events. Please try again later.' });
    }
};

// Create a new event
// controllers/eventController.js


// controllers/eventController.js
const createEvent = async (req, res) => {
  try {
    // Check if user is authenticated and has the "organizer" role
    if (!req.user || req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organizers can create events.' });
    }

    // Destructure required fields from the request body
    const { name, description, date, time, type, maxCapacity } = req.body;

    // Validate that all required fields are provided
    if (!name || !date || !time || !type || !maxCapacity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Include the authenticated user's ID as the organizerId
    const eventData = {
      name,
      description,
      date,
      time,
      type,
      maxCapacity,
      organizerId: req.user.id,  // Add the authenticated user's ID
    };

    // Create and save the new event
    const newEvent = new Event(eventData);
    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error });
  }
};





// Update an existing event
const updateEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Ensure the logged-in user is the organizer of this event
        if (event.organizerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this event.' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error.message);
        res.status(500).json({ message: 'Failed to update event. Please try again later.' });
    }
};

// Delete an event
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Ensure the logged-in user is the organizer of this event
        if (event.organizerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this event.' });
        }

        await event.remove();
        res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (error) {
        console.error('Error deleting event:', error.message);
        res.status(500).json({ message: 'Failed to delete event. Please try again later.' });
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};
