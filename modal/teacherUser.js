import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    
    class: { 
        type: String,
        required: true,
     },
        password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /^[A-Za-z0-9+_.-]+@(.+)$/, 
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    phone: { type: Number, required: true },
    instituteRegistrationNumber:{
        type:String, required:true,
    },
    subjects: { 
        type: String,
        required: true,
     }, 

    created_at: {
        type: Date,
        default: Date.now,
    },
});

const TeacherUserModel = mongoose.model('TeacherUsers', userSchema);

export default TeacherUserModel;


















    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'SuperAdmin',
    //   required: true,
    // },