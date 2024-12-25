import jwt from "jsonwebtoken";

const authmiddleware = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers.authorization;

  // Check if the token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part

  try {
    // Verify the token
    const decoded = jwt.verify(token, "TaskManager");

    // Attach user info from token to the request object

    // console.log(decoded);
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid or expired token
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const isAdminmiddleware = (req, res, next) => {
  // Check if the user object exists and has the isAdmin property
  console.log(req.user);
const {isAdmin} = req.user;
console.log(isAdmin);
  if (!isAdmin) {
    return res.status(403).json({
      message: "You are not authorized to access this resource.",
    });
  }

  // If the user is authorized, proceed to the next middleware or route
  next();
};


export { authmiddleware,isAdminmiddleware };
