import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const requiresAuth = function (request) {
  const encodedToken = request.header.authorization;
  const decodedToken = jwt.decode(encodedToken, process.env.SECRET);
  
};
