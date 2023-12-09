import { UserRoles } from "../users/userRoles.js";
import StudentUserModel from "../modal/studentUser.js";


export const postNotes = async (req, res) => {      
    console.log("Inside postNotes", req.userRole);
    if (req.userRole === UserRoles.USER) {
      const newNotes = req.body;
      const studentId = req.params.studentID;
      const classId = req.params.classID;
      if (!newNotes || !newNotes.title || !newNotes.content) {
        return res.status(400).json({ error: 'Invalid data format' });
      }
  
      try {
        const student = await StudentUserModel.findOne({
          $and: [
            { registrationNumber: studentId },
            { class: classId }
          ]
        });
  
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
        const existingNote = student.notes.find(note => note.title === newNotes.title);
        if (existingNote) {
          let uniqueTitle = newNotes.title;
          let titleIncrement = 1;
          while (student.notes.some(note => note.title === uniqueTitle)) {
            uniqueTitle = `${newNotes.title}_${titleIncrement}`;
            titleIncrement++;
          }
          newNotes.title = uniqueTitle;
        }
  
        student.notes.push(newNotes);
        await student.save();
  
        res.status(201).json(student);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(403).json({ result: 'Permission denied' });
    }
  };
  
  
  export const getNotes = async (req, res) => {
    console.log("Inside getNotes", req.userRole);
    if (req.userRole === UserRoles.STUDENT) {
      const studentId = req.params.studentID;
      const classId = req.params.classID;
    
      try {
        const student = await StudentUserModel.findOne({
          $and: [
            { registrationNumber: studentId },
            { class: classId }
          ]
        });
  
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
  
        res.status(201).json(student.notes);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(403).json({ result: 'Permission denied' });
    }
  };
  
  export const getSingleNote = async (req, res) => {
    console.log("Inside getSingleNote", req.userRole);
    if (req.userRole === UserRoles.STUDENT) {
      const newNotes = req.body;
      const studentId = req.params.studentID;
      const classId = req.params.classID;
      const titleGiven = req.params.title;
     
      try {
        const student = await StudentUserModel.findOne({
          $and: [
            { registrationNumber: studentId },
            { class: classId }
          ]
        });
  
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
  
        const existingNote = student.notes.find(note => note.title === titleGiven);
  
        if (existingNote) {
          res.status(201).json(existingNote);
  
        }
        else{
  
        return res.status(404).json({ error: 'No notes with this title is not found' });
        }
  
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(403).json({ result: 'Permission denied' });
    }
  };
  
  export const deleteSingleNote = async (req, res) => {
    console.log("Inside deleteSingleNote", req.userRole);
    if (req.userRole === UserRoles.STUDENT) {
      const studentId = req.params.studentID;
      const classId = req.params.classID;
      const noteTitle = req.params.title;
  
      try {
        const student = await StudentUserModel.findOne({
          $and: [
            { registrationNumber: studentId },
            { class: classId }
          ]
        });
  
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
        const noteIndex = student.notes.findIndex(note => note.title == noteTitle);
  
        if (noteIndex === -1) {
          return res.status(404).json({ error: 'Note not found' });
        }
        student.notes.splice(noteIndex, 1);
        await student.save();
  
        res.status(200).json({ message: 'Note deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(403).json({ result: 'Permission denied' });
    }
  };
  
  
  export const deleteNotes = async (req, res) => {
    console.log("Inside deleteNotes", req.userRole);
    if (req.userRole === UserRoles.STUDENT) {
      const studentId = req.params.studentID;
      const classId = req.params.classID;
  
      try {
        const student = await StudentUserModel.findOne({
          $and: [
            { registrationNumber: studentId },
            { class: classId }
          ]
        });
  
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
  
        student.notes = [];
        await student.save();
  
        res.status(200).json({ message: 'All notes for the student deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(403).json({ result: 'Permission denied' });
    }
  };
  
  export const updateNote = async (req, res) => {
    console.log("Inside updateNote", req.userRole);
    if (req.userRole === UserRoles.STUDENT) {
      const updatedNote = req.body;
      const studentId = req.params.studentID;
      const classId = req.params.classID;
      const titleGiven = req.params.title;
  
      try {
        const student = await StudentUserModel.findOne({
          $and: [
            { registrationNumber: studentId },
            { class: classId }
          ]
        });
  
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
        const existingNote = student.notes.find(note => note.title === titleGiven);
  
        if (existingNote) {
          existingNote.title = updatedNote.title || existingNote.title;
          existingNote.content = updatedNote.content || existingNote.content;
  
          await student.save();
  
          res.status(200).json(existingNote);
        } else {
          return res.status(404).json({ error: 'Note with this title not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(403).json({ result: 'Permission denied' });
    }
  };