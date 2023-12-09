import { UserRoles } from "../users/userRoles.js";
import ClassDataModel from "../modal/classData.js";


export const getAllClassData = async (request, response) => {
    console.log("Inside getAllClassData", request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
      try {
        const foundClass = await ClassDataModel.findOne({ classID: request.params.id });
        console.log(foundClass);
  
        if (!foundClass) {
          response.status(404).json({ error: 'Class not found' });
          return;
        }
  
        response.status(200).json(foundClass);
      } catch (error) {
        response.status(500).json(error);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  };
  
  export const deleteClassData = async (request, response) => {
    console.log("Inside deleteClassData", request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
      try {
        const foundClass = await ClassDataModel.findOneAndDelete({ classID: request.params.id });
  
        if (!foundClass) {
          response.status(404).json({ error: 'Class not found' });
          return;
        }
  
        response.status(204).send();
      } catch (error) {
        response.status(500).json(error);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  };
  
  export const updateClassData = async (request, response) => {
    console.log("Inside updateClassData", request.userRole);
  
    if (request.userRole === UserRoles.TEACHER || UserRoles.ADMIN ) {
      try {
        const newClassID = request.body.classID;
  
        const foundClass = await ClassDataModel.findOne({ classID: request.params.id });
  
        if (!foundClass) {
          response.status(404).json({ error: 'Class not found' });
          return;
        }
        foundClass.classID = newClassID;
        await foundClass.save();
        response.status(200).json(foundClass);
      } catch (error) {
        response.status(500).json(error);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  };