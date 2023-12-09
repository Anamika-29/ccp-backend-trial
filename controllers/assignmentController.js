import { UserRoles } from "../users/userRoles.js";
import ClassDataModel from "../modal/classData.js";

export const uploadAssignment = async (req, res) => {
    console.log("Inside Upload Assignment", req.userRole);
        if (req.userRole === UserRoles.TEACHER) {
    try {
      let classData = await ClassDataModel.findOne({ classID: req.params.id });
      if (!classData) {
        classData = new ClassDataModel({ classID: req.params.id, Assignments: [] });
      }
      const nextAssignmentID = classData.Assignments.length + 1;
      const newAssignment = {
        assignmentID: nextAssignmentID.toString(),
        assignmentName: req.body.assignmentName,
        assignmentURL: req.file ? req.file.path : '',
        uploadedBy: req.body.uploadedBy,
        subject: req.body.subject,
      };
      classData.Assignments.push(newAssignment);
      await classData.save();
      return res.json({ message: 'File uploaded successfully', assignment: newAssignment });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
  }
  
export const getAllAssignments = async (request, response) => {
    console.log("Inside getAllAssignments",request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
        try {
            const foundClass = await ClassDataModel.findOne({classID:request.params.id});
            console.log(foundClass);
            response.status(200).json(foundClass.Assignments);
        } catch (error) {
            response.status(500).json(error);
        }
      } else {
        response.status(403).json({ result: 'Permission denied' });
      }  
  }
  
  
  
  export const getSingleAssignment = async (request, response) => {
    console.log("Inside getSingleAssignment",request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
        try {
            const foundClass = await ClassDataModel.findOne({classID:request.params.id});
            let assignmentFound = foundClass.Assignments.find(
              (assignment) => assignment.assignmentID === request.params.assignmentID
            );
          
            if (!assignmentFound) {
              response.status(404).json({ error: 'Assignment not found' });
              return;
            }
          
            response.status(200).json(assignmentFound);
        } catch (error) {
            response.status(500).json(error);
        }
      } else {
        response.status(403).json({ result: 'Permission denied' });
      }  
  }
  
  export const deleteAllAssignments = async (request, response) => {
    console.log("Inside deleteAllAssignments", request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
      try {
        const foundClass = await ClassDataModel.findOne({classID:request.params.id});
        if (!foundClass) {
          response.status(404).json({ error: 'Class not found' });
          return;
        }
        foundClass.Assignments = [];
        await foundClass.save();
        response.status(200).json({ message: 'All assignments deleted for the class.' });
      } catch (error) {
        console.error('Error deleting assignments:', error);
        response.status(500).json({ error: 'Internal Server Error' });
      }
  }
  }
  
  export const deleteSingleAssignment = async (request, response) => {
    console.log("Inside deleteSingleAssignment",request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
      try {
        const foundClass = await ClassDataModel.findOne({ classID: request.params.id });
        console.log(foundClass);
        const assignmentIndex = foundClass.Assignments.findIndex(
          (assignment) => assignment.assignmentID === request.params.assignmentID
        );
        if (assignmentIndex === -1) {
          response.status(404).json({ error: 'Assignment not found' });
          return;
        }
        foundClass.Assignments.splice(assignmentIndex, 1);
        await foundClass.save();
  
        response.status(200).json({ message: 'Assignment deleted successfully' });
      } catch (error) {
        response.status(500).json(error);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  }
  
  
  export const updateAssignment = async (request, response) => {
    console.log("Inside updateAssignment", request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
      try {
        const foundClass = await ClassDataModel.findOne({ classID: request.params.id });
        const assignmentToUpdate = foundClass.Assignments.find(
          (assignment) => assignment.assignmentID === request.params.assignmentID
        );
  
        if (!assignmentToUpdate) {
          response.status(404).json({ error: 'Assignment not found' });
          return;
        }
  
        assignmentToUpdate.assignmentName = request.body.assignmentName;
        assignmentToUpdate.uploadedBy = request.body.uploadedBy;
        assignmentToUpdate.subject = request.body.subject;
        await foundClass.save();
  
        response.status(200).json({ message: 'Assignment updated successfully' });
      } catch (error) {
        response.status(500).json(error);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  };