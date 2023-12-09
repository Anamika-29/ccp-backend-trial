import express from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import superadminLogin from '../controllers/loginController.js';
import assignment from '../middlewares/assignmentMulter.js';
import nodemailer from "nodemailer";
import lecture from '../middlewares/lectureMulter.js';
import { addInstitution,getInstitution,updateInstitution,deleteInstitution,findInstitute,deleteAllInstitution } from '../controllers/institutionController.js';
import { addStudent,getAllStudents,deleteAllStudents,getStudent,updateStudent,deleteStudent } from '../controllers/studentController.js';
import { addTeacher,getAllTeachers,deleteAllTeachers,getTeacher,updateTeacher,deleteTeacher } from '../controllers/teacherController.js';
import { updateAssignment,uploadAssignment,getAllAssignments,getSingleAssignment,deleteAllAssignments,deleteSingleAssignment } from '../controllers/assignmentController.js';
import { getAllClassData,deleteClassData,updateClassData } from '../controllers/classController.js';
import { deleteNote, updateNote, addNote, getNoteById, getNote} from '../controllers/userNoteController.js';
import { uploadLecture,getAllLectures,getSingleLecture,deleteAllLectures,deleteSingleLecture,updateLecture } from '../controllers/lectureController.js';
// import { postNotes,getNotes,deleteNotes,getSingleNote,deleteSingleNote,updateNote } from '../controllers/notesController.js';
import { addUser } from '../controllers/userController.js';
import { getEvent,getEventById,addEvent,updateEvent,deleteEvent } from '../controllers/userEventController.js';
import { addTodo, getAllTodos, toggleTodoDone, updateTodo,deleteTodo  } from '../controllers/userToDoController.js';
import { getAllGoals,addGoal } from '../controllers/userGoalController.js';

const main = async (request, response) => {
    console.log("Inside main ");
    console.log(request.body);
    const html = `Hi ${request.body.contactPerson}! Thankyou for your request to join CCP. Your request is under process. We'll get back to you soon.`;

  try {
    const transporter = nodemailer.createTransport({
//       Server name: smtp.office365.com
// // Port: 587
// // Encryption method: STARTTLS
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // Use secure connection (TLS)
      auth: {
        user: 'nilay_cloud@hotmail.com',
        pass: 'Cloud_123',
      },
    });

    const mailOptions = {
      from: 'nilay_cloud@hotmail.com',
      to: request.body.email,
      subject: "Response to request",
      text: 'This is a test email sent from Node.js and NodeMailer!',
      html: html,
    };

    // Use async/await to send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return response.json({ message: 'Email sent successfully'});

  } catch (error) {
    console.error('Error sending email:', error);
    return response.status(500).json({ error: 'Error sending email' });

  }
}



const route = express.Router();

route.post('/superadminLogin', superadminLogin);

route.post('/addUser',addUser);


route.post('/api/institutions/:token',verifyToken, addInstitution);//done
route.get('/api/institutions/:token',verifyToken, getInstitution); //done
route.put('/api/institutions/:registrationNumber/:token',verifyToken, updateInstitution); //to implement
route.delete('/api/institutions/:registrationNumber/:token',verifyToken, deleteInstitution); //done
route.get('/api/institutions/:registrationNumber/:token',verifyToken, findInstitute);//to implement
route.delete('/api/institutions/:token',verifyToken, deleteAllInstitution); // to implement


route.post('/addStudent/:instituteRegistrationNumber/:token',verifyToken, addStudent); //done
route.get('/allStudents/:token',verifyToken, getAllStudents); //done
route.delete('/allStudents/:token',verifyToken, deleteAllStudents);
route.get('/student/:registrationNumber/:token',verifyToken, getStudent);
route.put('/student/:registrationNumber/:token',verifyToken, updateStudent);
route.delete('/student/:registrationNumber/:token',verifyToken, deleteStudent);


route.post('/addTeacher/:instituteRegistrationNumber/:token',verifyToken, addTeacher); //done
route.get('/allTeachers/:token',verifyToken, getAllTeachers);
route.delete('/allTeachers/:token',verifyToken, deleteAllTeachers);
route.get('/teacher/:registrationNumber/:token',verifyToken, getTeacher);
route.put('/teacher/:registrationNumber/:token',verifyToken, updateTeacher);
route.delete('/teacher/:registrationNumber/:token',verifyToken, deleteTeacher);


route.post('/uploadAssignment/:id/:token',verifyToken, assignment.single('pdf'),uploadAssignment);
route.get('/allAssignments/:id/:token',verifyToken,getAllAssignments);
route.get('/assignment/:id/:assignmentID/:token',verifyToken,getSingleAssignment);
route.delete('/allAssignments/:id/:token',verifyToken,deleteAllAssignments);
route.delete('/assignment/:id/:assignmentID/:token',verifyToken,deleteSingleAssignment);
route.put('/assignment/:id/:assignmentID/:token',verifyToken,updateAssignment);

 
route.get('/class/:id/:token', verifyToken, getAllClassData);
route.delete('/class/:id/:token', verifyToken, deleteClassData);
route.put('/class/:id/:token', verifyToken, updateClassData);
 

route.post('/uploadLecture/:id/:token',verifyToken, lecture.single('video'), uploadLecture);
route.get('/allLectures/:id/:token',verifyToken,getAllLectures);
route.get('/lecture/:id/:lectureID/:token',verifyToken,getSingleLecture);
route.delete('/allLectures/:id/:token',verifyToken,deleteAllLectures);
route.delete('/lecture/:id/:lectureID/:token',verifyToken,deleteSingleLecture);
route.put('/lecture/:id/:lectureID/:token',verifyToken,updateLecture);

// route.post('/notes/:classID/:studentID/:token',verifyToken, postNotes);
// route.get('/notes/:classID/:studentID/:token',verifyToken, getNotes);
// route.delete('/notes/:classID/:studentID/:token',verifyToken, deleteNotes);
// route.get('/notes/:classID/:studentID/:title/:token',verifyToken, getSingleNote);
// route.delete('/notes/:classID/:studentID/:title/:token',verifyToken, deleteSingleNote);
// route.put('/notes/:classID/:studentID/:title/:token',verifyToken, updateNote);

route.post('/sendEmail',main);

route.delete("/user/:token/:registrationNumber/events/:id/delete",verifyToken, deleteEvent);
route.put("/user/:token/:registrationNumber/events/:id/update",verifyToken, updateEvent);
route.post("/user/:token/:registrationNumber/events",verifyToken, addEvent);
route.get("/user/:token/:registrationNumber/events/:id/show",verifyToken, getEventById);
route.get("/user/:token/:registrationNumber/events",verifyToken, getEvent);

route.delete("/user/:token/:registrationNumber/notes/:id/delete",verifyToken, deleteNote);
route.put("/user/:token/:registrationNumber/notes/:id/update",verifyToken, updateNote);
route.post("/user/:token/:registrationNumber/notes",verifyToken, addNote);
route.get("/user/:token/:registrationNumber/notes/:id/show",verifyToken, getNoteById);
route.get("/user/:token/:registrationNumber/notes",verifyToken, getNote);

// route.delete("/user/:token/:registrationNumber/goals/:id",verifyToken, deleteGoal);
// route.put("/user/:token/:registrationNumber/goals/:id",verifyToken, updateGoal);
route.post("/user/:token/:registrationNumber/goals",verifyToken, addGoal);
// route.get("/user/:token/:registrationNumber/goals/:id",verifyToken, getGoalById);
route.get("/user/:token/:registrationNumber/goals",verifyToken, getAllGoals);


route.post('/user/:token/:registrationNumber/todos',verifyToken, addTodo);
route.get('/user/:token/:registrationNumber/todos',verifyToken,getAllTodos );
route.get('/user/:token/:registrationNumber/todos/:id',verifyToken,toggleTodoDone)
route.put('/user/:token/:registrationNumber/todos/:id',verifyToken,updateTodo)
route.delete('/user/:token/:registrationNumber/todos/:id',verifyToken,deleteTodo)



export default route;


// import { Router } from "express";
// import {
// 	addNote,
// 	addNoteToList,
// 	archiveNote,
// 	createList,
// 	deleteList,
// 	deleteNote,
// 	editList,
// 	editNote,
// 	getAllLists,
// 	getAllNotes,
// 	getListsForNote,
// 	getNote,
// 	getNotesInList,
// 	moveNoteToTrash,
// 	removeNoteFromList,
// 	restoreNoteFromTrash,
// 	unArchiveNote,
// } from "../controllers/notes.mjs";
// import auth from "../middleware/auth.mjs";

// const router = Router();

// router.use(auth);

// // Notes

// router.get("/", getAllNotes);

// // Lists

// router.get("/lists", getAllLists);
// router.get("/list/:id", getNotesInList);
// router.post("/list", createList);
// router.put("/list/:id", editList);
// router.post("/list/:id", addNoteToList);
// router.put("/list/:id", removeNoteFromList);
// router.delete("/list/:id", deleteList);

// // Note

// router.get("/:id", getNote);
// router.get("/:id/lists", getListsForNote);
// router.post("/add", addNote);
// router.put("/edit/:id", editNote);
// router.put("/archive/:id", archiveNote);
// router.put("/unarchive/:id", unArchiveNote);
// router.put("/trash/:id", moveNoteToTrash);
// router.put("/restore/:id", restoreNoteFromTrash);
// router.delete("/delete/:id", deleteNote);




