import IndividualUserModel from "../modal/user.js";
import { UserRoles } from "../users/userRoles.js";

const handleError = (error, res) => {
  console.log("Inside handle Errors");
  // Errors Schema
  const SchemaErrors = { title: '', start: '', end: '' };

  // schema validation errors
  if (error.errors) {
    Object.values(error.errors).forEach((error) => {
      SchemaErrors[error.properties.path] = error.properties.message;
    });
    return res.status(500).json(SchemaErrors);
  }

  // Duplicate Errors
  else if (error.code == 11000) {
    console.log(error);
    SchemaErrors[Object.keys(error.keyPattern)[0]] = `This is a duplicate ${Object.keys(error.keyPattern)[0]}. please enter a new one`;
    return res.status(500).json(SchemaErrors);
  } else {
    return res.status(500).json("something went wrong");
  }
};

export const deleteEvent = async (req, res) => {
  console.log("Inside deleteEvent", req.userRole);

  const registrationNumber = req.params.registrationNumber;
  const eventId = req.params.id;
  if (req.userRole === "USER") {
    try {
      // Find the user based on registrationNumber
      const user = await IndividualUserModel.findOne({ registrationNumber });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the index of the event with the given eventId
      const eventIndex = user.events.findIndex((event) => event._id.toString() === eventId);

      // Check if the event exists
      if (eventIndex === -1) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Remove the event from the events array
      user.events.splice(eventIndex, 1);

      // Save the updated user document
      await user.save();

      res.status(200).json("Event has been deleted");
    } catch (err) {
      console.log(err);
      handleError(err, res);
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
};

export const updateEvent = async (req, res) => {
  console.log("Inside updateEvent", req.params.registrationNumber, req.params.id, req.userRole);

  const registrationNumber = req.params.registrationNumber;
  const eventId = req.params.id;
  if (req.userRole === "USER") {
    try {
      // Find the user based on registrationNumber
      const user = await IndividualUserModel.findOne({ registrationNumber });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the event within the user's events array based on eventId
      const eventIndex = user.events.findIndex((event) => event._id == eventId);

      if (eventIndex === -1) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Update the event properties with the ones in req.body
      user.events[eventIndex].title = req.body.title || user.events[eventIndex].title;
      user.events[eventIndex].start = req.body.start || user.events[eventIndex].start;
      user.events[eventIndex].end = req.body.end || user.events[eventIndex].end;
      user.events[eventIndex].describe = req.body.describe || user.events[eventIndex].describe;

      // Save the updated user with the modified event
      await user.save();

      // Send the updated event as a response
      const updatedEvent = user.events[eventIndex];
      res.status(200).json(updatedEvent);
    } catch (err) {
      console.log(err);
      handleError(err, res);
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
};

export const addEvent = async (req, res) => {
  console.log("Inside Add Event", req.userRole);

  const { registrationNumber } = req.params;
  console.log(registrationNumber);
  if (req.userRole === "USER") {
    try {
      const user = await IndividualUserModel.findOne({ registrationNumber });
      console.log(user);
      if (!user) {
        console.log("User not Found");
        return res.status(404).json({ error: "User not found" });
      }

      // Create a new event using the request body
      const newEvent = req.body;

      // Add the event to the user's events array
      user.events.push(newEvent);

      // Save the user with the new event
      const savedUser = await user.save();
      console.log("User saved", savedUser);

      res.status(200).json(savedUser);
    } catch (err) {
      console.log("Inside Catch");
      console.log(err);

      handleError(err, res);
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
};

export const getEventById = async (req, res) => {
  console.log("Inside getEventById", req.userRole);

  const registrationNumber = req.params.registrationNumber;
  const eventId = req.params.id;
  if (req.userRole === "USER") {
    try {
      // Find the user based on registrationNumber
      const user = await IndividualUserModel.findOne({ registrationNumber });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the event within the user's events array based on eventId
      const event = user.events.find((event) => event._id == eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Send the found event as a response
      res.status(200).json(event);
    } catch (err) {
      console.log(err);
      handleError(err, res);
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
};

export const getEvent = async (req, res) => {
  console.log("Inside getEvent", req.userRole);

  const registrationNumber = req.params.registrationNumber;
  if (req.userRole === "USER") {
    try {
      // Find the user based on registrationNumber
      const user = await IndividualUserModel.findOne({ registrationNumber });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Send all events from the user's events array as a response
      res.status(200).json(user.events);
    } catch (err) {
      console.log(err);
      handleError(err, res);
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
};
