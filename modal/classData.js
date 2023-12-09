import mongoose from 'mongoose';

const classDataSchema = new mongoose.Schema({
  classID: String,
  Teachers: [
    {
        registrationNumber: { type: String, required: true },
        firstName: { type: String, required: true }, 
        lastName: { type: String, required: true },
    },
  ],
  Students: [
    {
      registrationNumber: { type: String, required: true },
      firstName: { type: String, required: true }, 
      lastName: { type: String, required: true },
    },
  ],
  Assignments: [
    {
      assignmentID: { type: String },
      assignmentName: { type: String },
      assignmentURL: { type: String },
      uploadedBy:{type: String},
      subject:{type: String},
    },
  ],
  
  SubjectLectures: [
    {
      subjectName: { type: String},
      
          lectureID: { type: String },
          lectureName: { type: String},
          lectureURL: { type: String },
          uploadedBy:{type: String},
    
    },
  ],
  created_at: { type: Date, default: Date.now },
});

const ClassDataModel = mongoose.model('classData', classDataSchema);

export default ClassDataModel;
