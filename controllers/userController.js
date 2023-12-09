import IndividualUserModel from "../modal/user.js";
import { UserRoles } from "../users/userRoles.js";

export const addUser = async (request, response) => {

  try {
    const { registrationNumber } = request.body;

    // Check if registrationNumber already exists
    const existingUser = await IndividualUserModel.findOne({ registrationNumber });

    if (existingUser) {
      // If registrationNumber already exists, throw an error
      return response.status(400).json({ result: "Registration number already exists" });
    }

    const newUser = new IndividualUserModel({
      ...request.body,
    });

    await newUser.save();
    console.log(newUser);
    return response.status(200).json(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(field => ({
        field,
        message: error.errors[field].message,
      }));
  
      return response.status(500).json({ result:  validationErrors[0].message });

    }
  }
};
