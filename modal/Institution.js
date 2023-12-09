import mongoose from 'mongoose';



const institutionSchema =  new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique:true }, 
    
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    
    address: { type: String, required: true },
    email: {
        type: String,
        required: true,
        match: /^[A-Za-z0-9+_.-]+@(.+)$/, 
    },
    phone: { type: Number, required: true },
    password : {type: String, required: true},
    representativeName: { type: String, required: true },

    representativeEmail: {
        type: String,
        required: true,
        match: /^[A-Za-z0-9+_.-]+@(.+)$/, 
    },
    representativePhone: { type: Number, required: true },
    
    created_at: { type: Date, default: Date.now },
    
})

const institute = mongoose.model('institution', institutionSchema); //collection name and Schema

export default institute;

















    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'SuperAdmin',
    //   required: true,
    // },