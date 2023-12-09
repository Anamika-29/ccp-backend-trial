import express from 'express';
const route = express.Router();
import superadminLogin from "../controllers/loginController.js";

route.post('/superadminLogin', superadminLogin);
module.exports = route;
