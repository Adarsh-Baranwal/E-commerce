import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_TOKEN, {
    expiresIn: "24h",
  });
};

export default generateToken;
