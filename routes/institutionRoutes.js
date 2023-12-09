import express from 'express';
const route = express.Router();
import {addInstitution,getInstitution,updateInstitution,deleteInstitution,findInstitute,deleteAllInstitution} from "../controllers/institutionController.js"
import verifyToken from '../middlewares/authMiddleware.js';
route.post('/api/institutions/:token',verifyToken, addInstitution);//done
route.get('/api/institutions/:token',verifyToken, getInstitution); //done
route.put('/api/institutions/:registrationNumber/:token',verifyToken, updateInstitution); //to implement
route.delete('/api/institutions/:registrationNumber/:token',verifyToken, deleteInstitution); //done
route.get('/api/institutions/:registrationNumber/:token',verifyToken, findInstitute);//to implement
route.delete('/api/institutions/:token',verifyToken, deleteAllInstitution); // to implement

module.exports = route;





