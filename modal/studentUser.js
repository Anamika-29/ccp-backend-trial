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
    phone: {
        type: Number,
        required: true,
    },
    instituteRegistrationNumber: {
        type: String,
        required: true,
    },
    results: [
        {
            subjectName: { type: String },
            score: { type: Number },
        },
    ],
    notes: [
        {
            title: { type: String },
            content: { type: String },
        },
    ],
    // assignment: [
    //     {
    //         title: { type: String },
    //         content: { type: String },
    //     },
    // ],

    gender: { type: String }, // Add Gender field
    doB: { type: Date }, // Add Date of Birth field
    sectionRollNumber: { type: String }, // Add Section Roll Number field
    admissionDate: { type: Date }, // Add Admission Date field
    academicYear: { type: String }, // Add Academic Year field
    fatherName: { type: String }, // Add Father's Name field
    admissionNumber: { type: String },// Add Admission Number field
});

const StudentUserModel = mongoose.model('StudentUsers', userSchema);

export default StudentUserModel;



















    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'SuperAdmin',
    //   required: true,
    // },