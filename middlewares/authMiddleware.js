import jwt from "jsonwebtoken";

const secretKey = "ccp123";

const verifyToken = (req, res, next) => {
    console.log("Verify Token");
    const {token} = req.params;
    const authHeader = token;
    if (typeof authHeader !== "undefined") {
      const token = authHeader;
  
      if (!token) {
        console.log("Invalid token format");
        return res.status(401).json({ error: "Invalid token format" });
      }
  
      try {
        const { user } = jwt.verify(token, secretKey);
        console.log("user:", user);
        req.userRole = user;
        next();
      } catch (err) {
        console.log("Token is not valid");
        return res.status(401).json({ error: "Token is not valid" });
      }
    } else {
      console.log("Token is missing");
      res.status(401).json({ error: "Token is missing" });
    }
  };
  

export default verifyToken;
