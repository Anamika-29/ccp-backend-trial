import { UserRoles } from "../users/userRoles.js";
import ClassDataModel from "../modal/classData.js";

export const uploadLecture = async (req, res) => {
    console.log("Inside Upload Lecture", req.userRole);
        if (req.userRole === UserRoles.TEACHER) {
    try {
      let classData = await ClassDataModel.findOne({ classID: req.params.id });
      if (!classData) {
        classData = new ClassDataModel({ classID: req.params.id, SubjectLectures: [] });
      }
      const nextVideoID = classData.SubjectLectures.length + 1;
      const newVideo = {
        subjectName: req.body.subjectName,
        lectureID: nextVideoID.toString(),
        lectureName: req.body.lectureName,
        lectureURL: req.file ? req.file.path : '',
        uploadedBy: req.body.uploadedBy,
      };
      classData.SubjectLectures.push(newVideo);
      await classData.save();
      return res.json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(403).json({ result: 'Permission denied' });
  }
  }
  
  
  
  export const getAllLectures = async (request, response) => {
    console.log("Inside getAllLectures",request.userRole);
    if (request.userRole === UserRoles.TEACHER) {
        try {
            const foundClass = await ClassDataModel.findOne({classID:request.params.id});
            response.status(200).json(foundClass.SubjectLectures);
        } catch (error) {
            response.status(500).json(error);
        }
      } else {
        response.status(403).json({ result: 'Permission denied' });
      }  
  }
  
  
  
  export const getSingleLecture = async (request, response) => {
    console.log("Inside getSingleLecture",request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
        try {
            const foundClass = await ClassDataModel.findOne({classID:request.params.id});
            let assignmentFound = foundClass.SubjectLectures.find(
              (assignment) => assignment.lectureID === request.params.lectureID
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
  
  export const deleteAllLectures = async (request, response) => {
    console.log("Inside deleteAllLectures", request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
      try {
        const foundClass = await ClassDataModel.findOne({classID:request.params.id});
        if (!foundClass) {
          response.status(404).json({ error: 'Class not found' });
          return;
        }
        foundClass.SubjectLectures = [];
        await foundClass.save();
        response.status(200).json({ message: 'All lectures deleted for the class.' });
      } catch (error) {
        console.error('Error deleting lectures:', error);
        response.status(500).json({ error: 'Internal Server Error' });
      }
  }
  }
  
  export const deleteSingleLecture = async (request, response) => {
    console.log("Inside deleteSingleLecture",request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
      try {
        const foundClass = await ClassDataModel.findOne({ classID: request.params.id });
        console.log(foundClass);
        const assignmentIndex = foundClass.SubjectLectures.findIndex(
          (assignment) => assignment.lectureID === request.params.lectureID
        );
  
        if (assignmentIndex === -1) {
          response.status(404).json({ error: 'Lecture not found' });
          return;
        }
        foundClass.SubjectLectures.splice(assignmentIndex, 1);
        await foundClass.save();
        response.status(200).json({ message: 'Lecture deleted successfully' });
      } catch (error) {
        response.status(500).json(error);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  }
  
  
  export const updateLecture = async (request, response) => {
    console.log("Inside updateLecture", request.userRole);
  
    if (request.userRole === UserRoles.TEACHER) {
      try {
        const foundClass = await ClassDataModel.findOne({ classID: request.params.id });
        const assignmentToUpdate = foundClass.SubjectLectures.find(
          (assignment) => assignment.lectureID === request.params.lectureID
        );
  
        if (!assignmentToUpdate) {
          response.status(404).json({ error: 'Lecture not found' });
          return;
        }
        assignmentToUpdate.subjectName = request.body.subjectName;
        assignmentToUpdate.uploadedBy = request.body.uploadedBy;
        assignmentToUpdate.lectureName = request.body.lectureName;
        await foundClass.save();
  
        response.status(200).json({ message: 'Lecture updated successfully' });
      } catch (error) {
        response.status(500).json(error);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    } 
  };
  
  