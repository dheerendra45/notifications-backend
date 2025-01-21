const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventcontroller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

// Public route (no authentication needed)
router.get('/', getEvents);

// Protected route (requires authentication and the 'organizer' role) for creating events
router.post(
  '/createevent', // Custom route for creating an event
  authMiddleware,  // First, check if the user is authenticated
  roleMiddleware('organizer'),  // Then, check if the user is an 'organizer'
  createEvent      // Only if both conditions are met, the user can create an event
);

// Protected route (requires authentication and the 'organizer' role) for updating events
router.put(
  '/updateevent/:id', // Custom route for updating an event
  authMiddleware,      // First, check if the user is authenticated
  roleMiddleware('organizer'), // Then, check if the user is an 'organizer'
  updateEvent          // Only if both conditions are met, the user can update the event
);

// Protected route (requires authentication and the 'organizer' role) for deleting events
router.delete(
  '/deleteevent/:id', // Custom route for deleting an event
  authMiddleware,      // First, check if the user is authenticated
  roleMiddleware('organizer'), // Then, check if the user is an 'organizer'
  deleteEvent          // Only if both conditions are met, the user can delete the event
);

module.exports = router;
