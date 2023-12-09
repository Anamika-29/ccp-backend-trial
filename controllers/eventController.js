import Event from "../modal/Event.js";
import handleEventErrors from "../utils/eventErrors.js";


export const getEvent = async(req, res)=>{

    const events = await Event.find({});
 
    try{
       
       res.status(200).json(events)

      
    }catch(err){
        handleEventErrors(err, res)
    }
};

export const getEventById = async(req, res)=>{
    const id =   req.params.id
    const event = await Event.findById(id);
 
    try{
       res.status(200).json(event)

      
    }catch(err){
        handleEventErrors(err, res)
    }
};



export const addEvent = async(req, res)=>{
   
        const newEvent = await new Event(req.body)
     
        try{
           await newEvent.save((err, event)=>{
                if(err){
                    handleEventErrors(err, res)
                }else{
                    res.status(200).json(event)
                }
            })
        }catch(err){
            handleEventErrors(err, res)
        }
    }




    export const updateEvent = async (req, res)=>{
    const id = req.params.id
     try{
        const event = await Event.findOne({_id : id})
        if(event){
            Object.assign(event, req.body);
             event.save((err, event)=>{
                if(err){
                    handleEventErrors(err, res)
                }else{
                    res.status(200).json(event)
                }
        })
    }   
        if(!event){
            res.status(404).json({error: "event is not found"})
        }
     }catch (err){
       console.log(err)
       handleEventErrors(err,res)
     }
 



//   const result = await Event.findOneAndUpdate(req.params.id,
//         {
//         $set: req.body,
//     }
//     , {new: true, runValidators: true}).clone()

//     try{
//         res.status(200).json(result)
//     }catch(err){
//         // res.status(500).json(Object.keys(result.errors)[0])
//         console.log(err)
//         res.status(400).json(err)
//     }
    // .then((docs, err)=>{
    //     if(docs){
    //         res.status(200).json(docs)
    //     }else{
    //         console.log(err.errors.path)
    //         handleEventErrors(err, res)
    //     }
    // })
}

export const deleteEvent = async(req, res)=>{
    const id = req.params.id;
    try{
        await Event.findByIdAndRemove(id)
        res.status(200).json("Event has been deleted");
    }catch(err){
        handleEventErrors(err, res)
    }

}

