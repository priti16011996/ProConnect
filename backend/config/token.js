import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Generated token:", token); // Log the generated token for debugging
    return token;
  } catch (err) {
    console.log(err);
  }
};

export { generateToken };
