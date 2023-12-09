// import IndividualUserModel from "../modal/user.js";


// export const addTodo = async (req, res) => {
//     console.log("Inside Add To Do", req.userRole);
  
//     const { registrationNumber } = req.params;
//     if (req.userRole === "USER") {
//       try {
//         const user = await IndividualUserModel.findOne({ registrationNumber });
//         if (!user) {
//           return res.status(404).json({ error: "User not found" });
//         }
  
//         const newTodo = {
//             data:req.body.data,
//             createdAt : Date.now()
//         }

  
//         // Add the event to the user's events array
//         user.todo.push(newTodo);
  
//         // Save the user with the new event
//         const savedUser = await user.save();
  
//         res.status(200).json(savedUser);
//       } catch (err) {
//         console.log(err);
  
//       }
//     } else {
//       res.status(403).json({ result: 'Permission denied' });
//     }
//   };



//   export const getAllTodos = async (req, res) => {
//     console.log("Inside getAllTodos", req.userRole);
  
//     const registrationNumber = req.params.registrationNumber;
//     if (req.userRole === "USER") {
//       try {
//         // Find the user based on registrationNumber
//         const user = await IndividualUserModel.findOne({ registrationNumber });
  
//         if (!user) {
//           return res.status(404).json({ error: "User not found" });
//         }
  
//         res.status(200).json(user.todo);
//       } catch (err) {
//         console.log(err);
//       }
//     } else {
//       res.status(403).json({ result: 'Permission denied' });
//     }
//   };




// export const toggleTodoDone = async (req,res) => {

//     console.log("Inside toggleTodoDone", req.params.registrationNumber, req.params.id, req.userRole);

//   const registrationNumber = req.params.registrationNumber;
//   const todoId = req.params.id;
//   if (req.userRole === "USER") {
//     try {
//       // Find the user based on registrationNumber
//       const user = await IndividualUserModel.findOne({ registrationNumber });

//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       // Find the event within the user's events array based on eventId
//       const toDoIndex = user.todo.findIndex((todo) => todo._id == todoId);

//       if (toDoIndex === -1) {
//         return res.status(404).json({ error: "To Do not found" });
//       }

//       const result = user.todo[toDoIndex].done;
//       user.todo[toDoIndex].done = !result;
//       await user.save();

//       const updatedTodo = user.todo[toDoIndex];
//       console.log(updateTodo);
//       res.status(200).json(updatedTodo);
//     } catch (err) {
//       console.log(err);
//     }
//   } else {
//     res.status(403).json({ result: 'Permission denied' });
//   }

    
// }

// export const updateTodo = async (req,res) => {


//     console.log("Inside updateTodo", req.params.registrationNumber, req.params.id, req.userRole);

//   const registrationNumber = req.params.registrationNumber;
//   const todoId = req.params.id;
//   if (req.userRole === "USER") {
//     try {
//       // Find the user based on registrationNumber
//       const user = await IndividualUserModel.findOne({ registrationNumber });

//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       // Find the event within the user's events array based on eventId
//       const toDoIndex = user.todo.findIndex((todo) => todo._id == todoId);

//       if (toDoIndex === -1) {
//         return res.status(404).json({ error: "To Do not found" });
//       }

//       // Update the event properties with the ones in req.body
//       user.todo[toDoIndex].data = req.body.data || user.todo[toDoIndex].data;

//       await user.save();

//       const updatedToDo = user.todo[toDoIndex];
//       res.status(200).json(updatedToDo);
//     } catch (err) {
//       console.log(err);
//     }
//   } else {
//     res.status(403).json({ result: 'Permission denied' });
//   }

// }

// export const deleteTodo = async (req,res) => {
//     console.log("Inside deleteTodo", req.userRole);

//   const registrationNumber = req.params.registrationNumber;
//   const todoId = req.params.id;
//   console.log("TODOID",todoId);
//   if (req.userRole === "USER") {
//     try {
//       // Find the user based on registrationNumber
//       const user = await IndividualUserModel.findOne({ registrationNumber });
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       // Find the index of the event with the given eventId
//       const todoIndex = user.todo.findIndex((todo) => todo._id.toString() === todoId);
//       console.log(todoIndex);

//       // Check if the event exists
//       if (todoIndex === -1) {
//         return res.status(404).json({ error: "To Do not found" });
//       }

//       // Remove the event from the events array
//       user.todo.splice(todoIndex, 1);

//       // Save the updated user document
//       await user.save();

//       res.status(200).json("To Do has been deleted");
//     } catch (err) {
//       console.log(err);
//     }
//   } else {
//     res.status(403).json({ result: 'Permission denied' });
//   }
// }






































import IndividualUserModel from "../modal/user.js";


export const addTodo = async (request,response) => {
    console.log("Inside addTodo");
    const registrationNumber = request.params.registrationNumber;
    console.log(registrationNumber);
  
    if(request.userRole==="USER"){
    try{
        const user = await IndividualUserModel.findOne({ registrationNumber });

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }
      const todoExists = user.todo.some((todo) => todo.data === request.body.data);

      if (todoExists) {
        return response.status(400).json({ error: "Todo with this data already exists" });
      }

    const newTodo = {
        data:request.body.data,
        createdAt : Date.now()
    }
    user.todo.push(newTodo);

    await user.save();
    console.log(user.todo);
    console.log(Date.now());
    
    let newTodoFound = user.todo.find((todo)=>todo.data===newTodo.data);
  
  // Get the complete newTodo with all additional data
//   const completeNewTodo = updatedUser.todo[newTodoIndex];
    return response.status(200).json(newTodoFound)

}catch(error){
    return response.status(500).json(error.message)
}
}
else {
    response.status(403).json({ result: 'Permission denied' });
  }
}

export const getAllTodos = async (request,response) => {
    console.log("Inside getAllTodos");
    const registrationNumber = request.params.registrationNumber;
    console.log(registrationNumber);
  
    if(request.userRole==="USER"){
        try{
            const user = await IndividualUserModel.findOne({ registrationNumber });

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }
        return response.status(200).json(user.todo)
    }catch(error){
        return response.status(500).json(error.message)
    }
}
else {
    response.status(403).json({ result: 'Permission denied' });
  }
}

export const toggleTodoDone = async (request,response) => {
    console.log("Inside toggleTodoDone");
    const registrationNumber = request.params.registrationNumber;
  
    if(request.userRole==="USER"){
        try{
            const user = await IndividualUserModel.findOne({ registrationNumber });
            

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }

        const todoRef =  user.todo.find((note) => note._id ==request.params.id);
        const todoIndex = user.todo.findIndex((note) => note._id == request.params.id);

      if (todoIndex === -1) {
        return res.status(404).json({ error: "To Do not found" });
      }

      // Update the event properties with the ones in req.body
      user.todo[todoIndex].done = !todoRef.done;
      
        await user.save()

        return response.status(200).json(user.todo[todoIndex])
    }catch(error){
        return response.status(500).json(error.message)
    }
}
else {
    response.status(403).json({ result: 'Permission denied' });
  }
}

export const updateTodo = async (request,response) => {
    console.log("Inside updateTodo")
    const registrationNumber = request.params.registrationNumber;
    console.log(registrationNumber);
    if(request.userRole==="USER"){
        try{
            const user = await IndividualUserModel.findOne({ registrationNumber });
            

            if (!user) {
              return response.status(404).json({ error: "User not found" });
            }
      
              const todoIndex = user.todo.findIndex((note) => note._id == request.params.id);
      
            if (todoIndex === -1) {
              return res.status(404).json({ error: "To Do not found" });
            }
      
            // Update the event properties with the ones in req.body
            user.todo[todoIndex].data = request.body.data;
            
              await user.save()
      
              return response.status(200).json(user.todo[todoIndex])
    }catch(error){
        return response.status(500).json(error.message)
    }
}
else {
    response.status(403).json({ result: 'Permission denied' });
  }

}

export const deleteTodo = async (request,response) => {
    console.log("Inside deleteTodo")
    
    const registrationNumber = request.params.registrationNumber;
    console.log(registrationNumber);
    if(request.userRole==="USER"){
        try{
            const user = await IndividualUserModel.findOne({ registrationNumber });
            

            if (!user) {
              return response.status(404).json({ error: "User not found" });
            }
      
              const todoRef =  user.todo.find((note) => note._id ==request.params.id);
              const todoIndex = user.todo.findIndex((note) => note._id == request.params.id);
      
            if (todoIndex === -1) {
              return res.status(404).json({ error: "To Do not found" });
            }
      
            const deletedTodo = user.todo.splice(todoIndex, 1)[0];
            
            
              await user.save()
      
              return response.status(200).json(deletedTodo)
    }catch(error){
        return response.status(500).json(error.message)
    }
}
else {
    response.status(403).json({ result: 'Permission denied' });
  }
}