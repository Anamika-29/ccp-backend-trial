
import IndividualUserModel from "../modal/user.js";


export const addGoal = async (request,response) => {
    console.log("Inside addGoal");
    const registrationNumber = request.params.registrationNumber;
  
    if(request.userRole==="USER"){
    try{
        const user = await IndividualUserModel.findOne({ registrationNumber });

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }
      const goalExists = user.goals.some((goal) => goal.data === request.body.data);

      if (goalExists) {
        return response.status(400).json({ error: "Goal with this data already exists" });
      }
    
    user.goals.push(request.body.formData);

    await user.save();
    
    
    return response.status(200).json(user.goals)

}catch(error){
    return response.status(500).json(error.message)
}
}
else {
    response.status(403).json({ result: 'Permission denied' });
  }
}

export const getAllGoals = async (request,response) => {
    console.log("Inside getAllGoals");
    
  
    if(request.userRole==="USER"){
        try{
            const user = await IndividualUserModel.findOne({ registrationNumber });

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }
        return response.status(200).json(user.goals)
    }catch(error){
        return response.status(500).json(error.message)
    }
}
else {
    response.status(403).json({ result: 'Permission denied' });
  }
}

export const toggleGoalDone = async (request,response) => {
    console.log("Inside toggleGoalDone");
    const registrationNumber = request.params.registrationNumber;
  
    if(request.userRole==="USER"){
        try{
            const user = await IndividualUserModel.findOne({ registrationNumber });
            

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }

        const goalRef =  user.todo.find((note) => note._id ==request.params.id);
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