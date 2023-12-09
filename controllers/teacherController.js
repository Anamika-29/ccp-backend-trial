import { UserRoles } from "../users/userRoles.js";
import TeacherUserModel from "../modal/teacherUser.js";
import ClassDataModel from "../modal/classData.js";

export const getTeacher = async (request, response) => {
    console.log("Inside getTeacher",request.userRole);
  
    if (request.userRole === UserRoles.ADMIN) {
      try {
        const foundTeacher = await TeacherUserModel.findOne({ registrationNumber: request.params.registrationNumber });
  
        if (!foundTeacher) {
            return response.status(404).json({ msg: 'Teacher not found' });
        }
  
        return response.status(200).json(foundTeacher);
    } catch (error) {
        response.status(500).json(error.message);
    }
  } else {
    response.status(403).json({ result: 'Permission denied' });
  }
  }

  export const updateTeacher = async (request, response) => {
    console.log("Inside updateTeacher",request.userRole);
    if (request.userRole === UserRoles.ADMIN) {
        try {
            const updatedTeacher = await TeacherUserModel.findOneAndUpdate(
                { registrationNumber: request.params.registrationNumber },
                request.body,
                { new: true }
            );
            if (!updatedTeacher) {
                return response.status(404).json({ msg: 'Teacher not found' });
            }
            return response.status(200).json(updatedTeacher);
        } catch (error) {
            response.status(500).json(error.message);
        }
      } else {
        response.status(403).json({ result: 'Permission denied' });
      }
    
   
  }
export const deleteAllTeachers = async (request, response) => {
    console.log("Inside deleteAllTeachers", request.userRole);
  
    if (request.userRole === UserRoles.ADMIN) {
      try {
        const result = await TeacherUserModel.deleteMany({});
        
        if (result.deletedCount === 0) {
          return response.status(404).json({ msg: 'No teachers found to delete' });
        }
  
        return response.status(200).json({ msg: 'All teachers deleted successfully' });
      } catch (error) {
        response.status(500).json(error.message);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  }
  
  
  export const deleteTeacher = async (request, response) => {
    console.log("Inside deleteTeacher",request.userRole);
  
    if (request.userRole === UserRoles.ADMIN) {
        try {
            const deletedTeacher = await TeacherUserModel.findOneAndRemove({ registrationNumber: request.params.registrationNumber });
    
            if (!deletedTeacher) {
                return response.status(404).json({ msg: 'Teacher not found' });
            }
    
            return response.status(200).json({ msg: 'Teacher deleted successfully' });
        } catch (error) {
            response.status(500).json(error.message);
        }
      } else {
        response.status(403).json({ result: 'Permission denied' });
      }
    
  }


export const getAllTeachers = async (request, response) => {
    console.log("Inside getAllTeachers",request.userRole);
  
    if (request.userRole === UserRoles.ADMIN) {
        try {
            const teachers = await TeacherUserModel.find({});
            response.status(200).json(teachers);
        } catch (error) {
            response.status(500).json(error);
        }
      } else {
        response.status(403).json({ result: 'Permission denied' });
      }  
  }

  export const addTeacher = async (request, response) => {
    console.log("Inside addTeacher", request.userRole);
    if (request.userRole === UserRoles.ADMIN) {
      try {
        let registrationNumber = `${request.body.firstName}.${request.body.lastName}`;
        const instituteRegistrationNumber = request.params.instituteRegistrationNumber;

        let count = 0;
        while (true) {
          const exist = await TeacherUserModel.findOne({ registrationNumber });
          if (!exist) {
            break;
          }
          count++;
          registrationNumber = `${request.body.firstName}.${request.body.lastName}${count}`;
        }
        const newUser = new TeacherUserModel({
          ...request.body,
          registrationNumber,
          instituteRegistrationNumber
        });
  
        await newUser.save();
  
        for (const classID of request.body.class) {
          const classData = await ClassDataModel.findOne({ classID });
  
          if (classData) {
            const teacherObject = {
              registrationNumber: newUser.registrationNumber,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
            };
  
            classData.Teachers.push(teacherObject);
            await classData.save();
          } else {
            const newClassData = new ClassDataModel({
              classID,
              Teachers: [
                {
                  registrationNumber: newUser.registrationNumber,
                  firstName: newUser.firstName,
                  lastName: newUser.lastName,
                },
              ],
            });
  
            try {
              await newClassData.save();
            } catch (error) {
              console.error('Error while creating a new class:', error.message);
              return response.status(500).json(error.message);
            }
          }
        }
  
        return response.status(200).json(newUser);
      } catch (error) {
        console.log(error.message);
        return response.status(500).json(error.message);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  };