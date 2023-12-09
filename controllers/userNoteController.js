import IndividualUserModel from "../modal/user.js";

const handleError = (error, res) => {
  console.log("Inside handle Errors");
  // Errors Schema
  const SchemaErrors = { title: '', content: '' };

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

export const deleteNote = async (req, res) => {
  console.log("Inside deleteNote", req.userRole);

  const registrationNumber = req.params.registrationNumber;
  const noteId = req.params.id;
  if (req.userRole === "USER") {
    try {
      // Find the user based on registrationNumber
      const user = await IndividualUserModel.findOne({ registrationNumber });
      console.log("User", user);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the index of the event with the given eventId
      const noteIndex = user.notes.findIndex((note) => note._id.toString() === noteId);
      console.log(noteIndex)

      // Check if the event exists
      if (noteIndex === -1) {
        return res.status(404).json({ error: "Note not found" });
      }

      // Remove the event from the events array
      user.notes.splice(noteIndex, 1);

      // Save the updated user document
      await user.save();

      res.status(200).json("Note has been deleted");
    } catch (err) {
      console.log(err);
      handleError(err, res);
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
};

export const updateNote = async (req, res) => {
  console.log("Inside updateNote", req.params.registrationNumber, req.params.id, req.userRole);

  const registrationNumber = req.params.registrationNumber;
  const noteId = req.params.id;
  if (req.userRole === "USER") {
    try {
      // Find the user based on registrationNumber
      const user = await IndividualUserModel.findOne({ registrationNumber });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the event within the user's events array based on eventId
      const noteIndex = user.notes.findIndex((note) => note._id == noteId);

      if (noteIndex === -1) {
        return res.status(404).json({ error: "Note not found" });
      }

      // Update the event properties with the ones in req.body
      user.notes[noteIndex].title = req.body.title || user.notes[noteIndex].title;
      user.notes[noteIndex].content = req.body.content || user.notes[noteIndex].content;

      // Save the updated user with the modified event
      await user.save();

      // Send the updated event as a response
      const updatedNote = user.notes[noteIndex];
      res.status(200).json(updatedNote);
    } catch (err) {
      console.log(err);
      handleError(err, res);
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
};

export const addNote = async (req, res) => {
  console.log("Inside Add Note", req.userRole);

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
      const newNote = req.body;

      // Add the event to the user's events array
      user.notes.push(newNote);

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

export const getNoteById = async (req, res) => {
  console.log("Inside getNoteById", req.userRole);

  const registrationNumber = req.params.registrationNumber;
  const noteId = req.params.id;
  if (req.userRole === "USER") {
    try {
      // Find the user based on registrationNumber
      const user = await IndividualUserModel.findOne({ registrationNumber });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the event within the user's events array based on eventId
      const note = user.notes.find((note) => note._id == noteId);

      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }

      // Send the found event as a response
      res.status(200).json(note);
    } catch (err) {
      console.log(err);
      handleError(err, res);
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
};

export const getNote = async (req, res) => {
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
      res.status(200).json(user.notes);
    } catch (err) {
      console.log(err);
      handleError(err, res);
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
};
