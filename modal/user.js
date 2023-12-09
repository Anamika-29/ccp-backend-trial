import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({

    registrationNumber: {
        type: String,
        required: [true, 'Email is required'],
        match: [
            /^[A-Za-z0-9+_.-]+@(.+)$/,
            'Please enter a valid email address',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [32, 'Password cannot exceed 32 characters'],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        ],
    },
    events: [
        {
            title: { type: String, required: [true, "Please write a title for your event"] },
            start: {
                type: Date,
                required: [true, "Please Insert The Start of your event"],
                // min: [new Date(), "can't be before now!!"],
            }, 
            end: {
                type: Date,
                //setting a min function to accept any date one hour ahead of start
                min: [function () {
                    const date = new Date(this.start)
                    const validDate = new Date(date.setHours(date.getHours() + 1))
                    return validDate
                }, "Event End must be at least one hour a head of event time"],
                default: function () {
                    const date = new Date(this.start)
                    return date.setDate(date.getDate() + 1)
                },
            },
            describe: { type: String },
        },

    ],
    notes: [
        {
            title: {
                type: String,
                required: [true, 'Title is required'],
                trim: true,
              },
              content: {
                type: String,
                required: [true, 'Content is required'],
              },
              createdAt: {
                type: Date,
                default: Date.now,
              }
        },
        

    ],
    todo : [
        {
            data : {
                type:String,
                required : true
            },
            done:{
                type:Boolean,
                default: false
            },
            createdAt:{
                type : Date,
                default : Date.now
            }
        }
    ],
    goals : [
        {
            data : {
                type:String,
                required : true
            },
            done:{
                type:Boolean,
                default: false
            },
            createdAt:{
                type : Date,
                default : Date.now
            },
            deadline: {
                type: Date,
                required: true,
              },
              for:{
                type:String,
                required : true

              },
              startDate:{
                type: Date,
                required: true,
              }

              

        }
    ],
    videos : [
        {title:{
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true,
        },
        videoUrl: {
            type: String,
            trim: true,
            required: true,
        },
        filename: {
            type: String,
           
            trim: true,
        }}
    ],
    images : [
        {title:{
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
            required: true,
        },
        filename: {
            type: String,
            trim: true,
        }}
    ],
    pdf : [
        {
        title:{
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true,
        },
        pdfUrl: {
            type: String,
            trim: true,
            required: true,
        },
        filename: {
            type: String,
            trim: true,
        }}
    ],



    created_at: { type: Date, default: Date.now },

})

const IndividualUserModel = mongoose.model('IndividualUsers', userSchema);

export default IndividualUserModel;
