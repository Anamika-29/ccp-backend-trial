import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const Connection = async (username, password) => {
    try {
        await  mongoose.connect(`mongodb://cloudologic12:childCollab@ac-ozuylzj-shard-00-00.t3xpzpn.mongodb.net:27017,ac-ozuylzj-shard-00-01.t3xpzpn.mongodb.net:27017,ac-ozuylzj-shard-00-02.t3xpzpn.mongodb.net:27017/?ssl=true&replicaSet=atlas-ff210a-shard-0&authSource=admin&retryWrites=true&w=majority`, {
              useNewUrlParser: true,
               useUnifiedTopology: true,
        });
        console.log('Database Connected Succesfully');
    } 
    catch(error) {
        console.log('Error: ', error.message);
    }

};

export default Connection;