import institute from "../modal/Institution.js";
import { UserRoles } from "../users/userRoles.js";

export const getInstitution = async (request, response) => {
    console.log("Inside Get Institute",request.userRole);

    if (request.userRole === UserRoles.SUPERADMIN) {
        try {
            const institutions = await institute.find({});
            response.status(200).json(institutions);
        } catch (error) {
            response.status(500).json(error);
        }
      } else {
        response.status(403).json({ result: 'Permission denied' });
      }  
}


export const addInstitution = async (request, response) => {
    console.log("Inside Add Institute", request.userRole);
  
    if (request.userRole === UserRoles.SUPERADMIN) {
      try {
        const institutionName = request.body.name;
        const registrationNumber = await generateUniqueRegistrationNumber(institutionName);
        const newUser = new institute({
          ...request.body,
          registrationNumber: registrationNumber,
        });
        await newUser.save();
        console.log(newUser);
        return response.status(200).json(newUser);
      } catch (error) {
        console.log(error);
        return response.status(500).json({ result: error.message });
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  }

  async function generateUniqueRegistrationNumber(institutionName) {
    const prefix = institutionName.substring(0, 3).toUpperCase();
    let registrationNumber = null;
    let isUnique = false;
    let uniqueNumber = 8126;
  
    while (!isUnique) {
      registrationNumber = `${prefix}${uniqueNumber}`;
      isUnique = !(await registrationNumberExists(registrationNumber));
      if (!isUnique) {
        uniqueNumber++; 
      }
    }
  
    return registrationNumber;
  }
  async function registrationNumberExists(registrationNumber) {
    try {
      const existingInstitution = await institute.findOne({ registrationNumber: registrationNumber });
      return !!existingInstitution;
    } catch (error) {
      console.error('Error checking registration number:', error);
      return false; 
    }
  }


  export const updateInstitution = async (request, response) => {
    console.log("Inside Update Institute", request.userRole);
    if (request.userRole === UserRoles.SUPERADMIN) {
        try {
            const updatedInstitution = await institute.findOneAndUpdate(
                { registrationNumber: request.params.registrationNumber },
                request.body,
                { new: true }
            );
            if (!updatedInstitution) {
              console.log("!updatedInstitution");
                return response.status(404).json({ msg: 'Institution not found' });
            }
            console.log(updatedInstitution);
  
            return response.status(200).json(updatedInstitution);
        } catch (error) {
          console.log("error");
          response.status(500).json({ error: error.message });
        }
    } else {
      console.log("errorPermission denied");
  
        response.status(403).json({ result: 'Permission denied' });
    }
  }
  

  export const deleteInstitution = async (request, response) => {
    console.log("Inside Delete Institute",request.userRole);

    if (request.userRole === UserRoles.SUPERADMIN) {
        try {
            const deletedInstitution = await institute.findOneAndRemove({ registrationNumber: request.params.registrationNumber });
    
            if (!deletedInstitution) {
                return response.status(404).json({ msg: 'Institution not found' });
            }
    
            return response.status(200).json({ msg: 'Institution deleted successfully' });
        } catch (error) {
            response.status(500).json(error.message);
        }
      } else {
        response.status(403).json({ result: 'Permission denied' });
      }
    
}


export const findInstitute = async (request, response) => {
    console.log("Inside Find Institute",request.userRole);
  
    if (request.userRole === UserRoles.SUPERADMIN) {
      try {
        const foundInstitute = await institute.findOne({ registrationNumber: request.params.registrationNumber });
  
        if (!foundInstitute) {
            return response.status(404).json({ msg: 'Institution not found' });
        }
  
        return response.status(200).json(foundInstitute);
    } catch (error) {
        response.status(500).json(error.message);
    }
  } else {
    response.status(403).json({ result: 'Permission denied' });
  }
  }

  export const deleteAllInstitution = async (request, response) => {
    console.log("Inside deleteAllInstitution", request.userRole);
  
    if (request.userRole === UserRoles.SUPERADMIN) {
      try {
        const result = await institute.deleteMany({});
        
        if (result.deletedCount === 0) {
          return response.status(404).json({ msg: 'No institutions found to delete' });
        }
  
        return response.status(200).json({ msg: 'All institutions deleted successfully' });
      } catch (error) {
        response.status(500).json(error.message);
      }
    } else {
      response.status(403).json({ result: 'Permission denied' });
    }
  }