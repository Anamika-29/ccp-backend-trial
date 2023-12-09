import { UserRoles } from "../users/userRoles.js";
import StudentUserModel from "../modal/studentUser.js";
import ClassDataModel from "../modal/classData.js";


export const deleteStudent = async (request, response) => {
    console.log("Inside deleteStudent",request.userRole);
  
    if (request.userRole === UserRoles.ADMIN) {
        try {
            const deletedStudent = await StudentUserModel.findOneAndRemove({ registrationNumber: request.params.registrationNumber });
    
            if (!deletedStudent) {
                return response.status(404).json({ msg: 'Student not found' });
            }
    
            return response.status(200).json({ msg: 'Student deleted successfully' });
        } catch (error) {
            response.status(500).json(error.message);
        }
      } else {
        response.status(403).json({ result: 'Permission denied' });
      }
    
  }

  export const deleteAllStudents = async (request, response) => {
    console.log("Inside deleteAllStudents", request.userRole);
  
    if (request.userRole === UserRoles.ADMIN) {
      try {
        const result = await StudentUserModel.deleteMany({});
        
        if (result.deletedCount === 0) {
          return response.status(404).json({ msg: 'No students found to delete' });
        }
  
        return response.status(200).json({ msg: 'All students deleted successfully' });
      } catch (error) {
        response.status(500).json(error.message);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  }
  
export const updateStudent = async (request, response) => {
    console.log("Inside updateStudent",request.userRole);
    if (request.userRole === UserRoles.ADMIN) {
        try {
            const updatedStudent = await StudentUserModel.findOneAndUpdate(
                { registrationNumber: request.params.registrationNumber },
                request.body,
                { new: true }
            );
            if (!updatedStudent) {
                return response.status(404).json({ msg: 'Student not found' });
            }
            return response.status(200).json(updatedStudent);
        } catch (error) {
            response.status(500).json(error.message);
        }
      } else {
        response.status(403).json({ result: 'Permission denied' });
      }
  }


export const addStudent = async (request, response) => {
    console.log("Inside addStudent",request.userRole);
    if (request.userRole === UserRoles.ADMIN) {
        try {
          let registrationNumber = `${request.body.firstName}.${request.body.lastName}`;
          const instituteRegistrationNumber = request.params.instituteRegistrationNumber;
      let count = 0;
      while (true) {
        const exist = await StudentUserModel.findOne({ registrationNumber });
        if (!exist) {
          break;
        }
        count++;
        registrationNumber = `${request.body.firstName}.${request.body.lastName}${count}`;
      }
      const newUser = new StudentUserModel({
        ...request.body,
        registrationNumber,
        instituteRegistrationNumber
      });

      await newUser.save();
            const studentObject = {
              registrationNumber: newUser.registrationNumber,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
            };
            
            const classData = await ClassDataModel.findOne({ classID: request.body.class });
            
            if (classData) {
              classData.Students.push(studentObject);
              await classData.save();
            } else {
              const newClassData = new ClassDataModel({
                classID: request.body.class,
                Students: [studentObject], 
              });
            
              try {
                await newClassData.save();
              } catch (error) {
                console.error('Error while creating a new class:', error.message);
                return response.status(500).json(error.message);
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
    }

    export const getAllStudents = async (request, response) => {
        console.log("Inside getAllStudents",request.userRole);
      
        if (request.userRole === UserRoles.ADMIN) {
            try {
                const students = await StudentUserModel.find({});
                response.status(200).json(students);
            } catch (error) {
                response.status(500).json(error);
            }
          } else {
            response.status(403).json({ result: 'Permission denied' });
          }  
      }

export const getStudent = async (request, response) => {
    console.log("Inside getStudent",request.userRole);
  
    if (request.userRole === UserRoles.ADMIN) {
      try {
        const foundStudent = await StudentUserModel.findOne({ registrationNumber: request.params.registrationNumber });
  
        if (!foundStudent) {
            return response.status(404).json({ msg: 'Student not found' });
        }
  
        return response.status(200).json(foundStudent);
    } catch (error) {
        response.status(500).json(error.message);
    }
  } else {
    response.status(403).json({ result: 'Permission denied' });
  }
  }

