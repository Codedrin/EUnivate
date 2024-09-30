import Event from "../../models/Admin/addEvents.js"; 


const createEvent = async (req, res) => {
  try {
    const { webinarName, description, dateAndTime, embeddedLink, image } = req.body;

    if (!image || !image.url) {
      return res.status(400).json({ error: 'No image URL provided' });
    }

    const newEvent = new Event({
      webinarName,
      description,
      dateAndTime,
      embeddedLink,
      image,
    });

    const savedEvent = await newEvent.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error in createEvent:", error.message);
    return res.status(500).json({ error: error.message || 'An error occurred while creating the event' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
};

//Updateevents 
const updateEvent = async (req, res) => {
  const { webinarName, description, dateAndTime, embeddedLink, image } = req.body;
  const { id } = req.params;  // Ensure you're getting id from the request parameters

  try {
    const updatedFields = {
      webinarName,
      description,
      dateAndTime,
      embeddedLink,
    };

    // If image is provided, update the image field
    if (image && image.url) {
      updatedFields.image = { url: image.url };
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error.message);
    return res.status(500).json({ error: 'An error occurred while updating the event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    return res.status(500).json({ error: 'Failed to delete event' });
  }
};


export { createEvent, updateEvent };
