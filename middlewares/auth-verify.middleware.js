import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authVerify = (req, res, next) => {
  const encodedToken = req.headers.authorization.replace(/"/g, "");
  try {
    const decodedToken = jwt.verify(encodedToken, process.env.SECRET);
    req.user = { _id: decodedToken._id, encodedToken };
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).send("Invalid token. Unauthorized access error");
  }
};

export default authVerify;
