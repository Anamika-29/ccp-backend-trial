import { UserRoles } from "../users/userRoles.js";
import StudentUserModel from "../modal/studentUser.js";
import institute from "../modal/Institution.js";
import TeacherUserModel from '../modal/teacherUser.js';
import IndividualUserModel from "../modal/user.js";
import jwt from "jsonwebtoken";
import http from "http";
import redis from "redis";

const cachePassword = "MM6yfSb1lXBxM54b99o6iLuACp83PvYUzAzCaGfPPTM=";
const cacheHostName = "ccp.redis.cache.windows.net";


const cacheConnection = redis.createClient({
  url:`rediss://${cacheHostName}:6380`,
  password: cachePassword
});

await cacheConnection.connect();

console.log("Cache Response:"+await cacheConnection.ping());

const secretKey = "ccp123";
async function setKeyValue(key, registrationNumber, password, ipAddress) {
    console.log(key,registrationNumber,password,ipAddress);
    
    try {
      const jsonObject = {
        registrationNumber,
        password,
        ipAddress,
      };
      await cacheConnection.set(key, JSON.stringify(jsonObject));
      console.log(`Set key "${key}" with JSON value: ${JSON.stringify(jsonObject)}`);
    } catch (error) {
      console.error('Error setting key-value pair:', error);
    }
  }

  async function getValueFromRedis(key) {
    try {
      const value = await cacheConnection.get(key);
      if (value !== null) {
        console.log(`Value for key "${key}": ${value}`);
        return value;
      } else {
        console.log(`Key "${key}" not found in Redis`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching value from Redis:', error);
      return null;
    }
  }

  async function deleteKeyFromRedis(key) {
    try {
      const result = await cacheConnection.del(key);
      if (result === 1) {
        console.log(`Key "${key}" deleted successfully.`);
        return true;
      } else {
        console.log(`Key "${key}" not found in Redis.`);
        return false;
      }
    } catch (error) {
      console.error('Error deleting key from Redis:', error);
      return false;
    }
  }
  const superadminLogin = async (request, response) => { 
    const { registrationNumber, password } = request.body;

    const institution = await institute.findOne({registrationNumber });
    const student = await StudentUserModel.findOne({registrationNumber}); 
    const teacher = await TeacherUserModel.findOne({registrationNumber});
    const user = await IndividualUserModel.findOne({registrationNumber});
    

    


    try {
        console.log("Inside Login",registrationNumber,password);
        if (registrationNumber === "Admin123" && password === "Admin123") {
            const role = UserRoles.SUPERADMIN;
            jwt.sign({user: role                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    , registrationNumber:registrationNumber }, secretKey, (err, token) => {
                if (err) {
                    return response.status(500).json({ msg: 'Error generating token' });
                }
                response.status(200).json({  
                    "token":
                    token,
                    "role":role

                });
            });
        }
        else if (institution && institution.password === password) {
            const role = UserRoles.ADMIN;
            jwt.sign({user: role, registrationNumber:registrationNumber }, secretKey, (err, token) => {
                if (err) {
                    return response.status(500).json({ msg: 'Error generating token' });
                }
                response.status(200).json({  
                    "token":
                    token,
                    "role":role
                });
            });
        }
        else if (student && student.password === password) {
            const role = UserRoles.STUDENT;
            jwt.sign({user: role, registrationNumber:registrationNumber }, secretKey, (err, token) => {
                if (err) {
                    return response.status(500).json({ msg: 'Error generating token' });
                }
                response.status(200).json({  
                    "token":
                    token,
                    "role":role,
                    "instituteRegistrationNumber" : student.instituteRegistrationNumber,

                });
            });
        }
        else if (user && user.password === password) {
          const role = UserRoles.USER;
          jwt.sign({user: role, registrationNumber:registrationNumber }, secretKey, (err, token) => {
              if (err) {
                  return response.status(500).json({ msg: 'Error generating token' });
              }
              response.status(200).json({  
                  "token":
                  token,
                  "role":role
              });
          });
      }
        else if (teacher && teacher.password === password) {
            const role = UserRoles.TEACHER;
            jwt.sign({user: role, registrationNumber:registrationNumber }, secretKey, (err, token) => {
                if (err) {
                    return response.status(500).json({ msg: 'Error generating token' });
                }
                response.status(200).json({  
                    "token":
                    token,
                    "role":role,
                    "instituteRegistrationNumber" : teacher.instituteRegistrationNumber,

                });
            });
        }
        else {
            return response.status(500).json({ message: "Invalid login" });
        }
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}

  
// const superadminLogin = async (request, response) => { 
 

//     // let ipBuffer = Buffer.alloc(0); 
//     // http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
       
//     //     resp.on('data', function (chunk) {
//     //         ipBuffer = Buffer.concat([ipBuffer, chunk]); 
//     //       });
//     //       resp.on('end', async function () {
//     //         const ip = ipBuffer.toString();
           
//            try {
//             const { registrationNumber, password } = request.body;

//             const institution =  institute.findOne({registrationNumber });
//             const student =  StudentUserModel.findOne({registrationNumber}); 
//             const teacher =  TeacherUserModel.findOne({registrationNumber});
//             const userNew =  IndividualUserModel.findOne({registrationNumber});
//             console.log(userNew);
//                console.log("Inside Login",registrationNumber,password);
//                if (registrationNumber === "Admin123" && password === "Admin123") {
//                    const role = UserRoles.SUPERADMIN;
       
                 
//                   //  const redisData = await getValueFromRedis(`${registrationNumber}-${role}`);
//                   //  console.log("Redis Data is " + redisData);
//                   //  let ipAddress = "";
//                   //  if ( redisData){
//                   //  const redisDataString = JSON.parse(redisData);

//                   //   ipAddress = redisDataString.ipAddress;

//                   //  }

//             // if (!redisData || ipAddress===ip) {
//               jwt.sign({user: role, registrationNumber:registrationNumber }, secretKey, (err, token) => {
//                 // if (err) {
//                 //     return response.status(500).json({ msg: 'Error generating token' });
//                 // }
//                 response.status(200).json({  
//                     "token":
//                     token,
//                     "role":role

//                 });
//             });
//             // await setKeyValue(`${registrationNumber}-${role}`, registrationNumber, password, ip);
            
//             // }
//             // else{
//             //   console.log("Device is already Logged In");
                
//             // }
                   
                     
       
//                }
//                else if (institution && institution.password === password) {
//                    const role = UserRoles.ADMIN;
//                    jwt.sign({user: role, registrationNumber:registrationNumber }, secretKey, (err, token) => {
//                        if (err) {
//                            return response.status(500).json({ msg: 'Error generating token' });
//                        }
//                        response.status(200).json({  
//                            "token":
//                            token,
//                            "role":role
//                        });
//                    });
//                }
//                else if (student && student.password === password) {
//                    const role = UserRoles.STUDENT;
//                    jwt.sign({user: role, registrationNumber:registrationNumber }, secretKey, (err, token) => {
//                        if (err) {
//                            return response.status(500).json({ msg: 'Error generating token' });
//                        }
//                        response.status(200).json({  
//                            "token":
//                            token,
//                            "role":role,
//                            "instituteRegistrationNumber" : student.instituteRegistrationNumber,
       
//                        });
//                    });
//                }
//                else if (userNew && userNew.password === password) {
//                 const role = UserRoles.USER;
//                 jwt.sign({user: role, registrationNumber:registrationNumber }, secretKey, (err, token) => {
//                     if (err) {
//                         return response.status(500).json({ msg: 'Error generating token' });
//                     }
//                     response.status(200).json({  
//                         "token":
//                         token,
//                         "role":role,
//                         // "instituteRegistrationNumber" : teacher.instituteRegistrationNumber,
    
//                     });
//                 });
//             }
//                else if (teacher && teacher.password === password) {
//                    const role = UserRoles.TEACHER;
//                    jwt.sign({user: role, registrationNumber:registrationNumber }, secretKey, (err, token) => {
//                        if (err) {
//                            return response.status(500).json({ msg: 'Error generating token' });
//                        }
//                        response.status(200).json({  
//                            "token":
//                            token,
//                            "role":role,
//                            "instituteRegistrationNumber" : teacher.instituteRegistrationNumber,
       
//                        });
//                    });
//                }
//                else {
//                    return response.status(500).json({ message: "Invalid login" });
//                }
//            }
//            catch (error) {
//                return response.status(500).json(error.message);
//            }
//           }
//         // });
//       // });
    
// // }

export default superadminLogin;