import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const signUp = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  console.log(username, email, password, confirmPassword);
  // Validate input fields
  if (!username || !email || !password || !confirmPassword) {
    console.log("All fields are required");
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Validate email format (simple regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("Invalid email format");
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // Validate password strength
  if (password.length < 5) {
    console.log("Password must be at least 8 characters long");
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  if (password !== confirmPassword) {
    console.log("Password and confirm password do not match");
    return res.status(400).json({
      success: false,
      message: "Password and confirm password do not match",
    });
  }

  try {
    // Check if username exists
    const ifUserExists = await User.findOne({ username });
    if (ifUserExists) {
      console.log("Username already taken");
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    // Check if email exists
    const ifEmailExists = await User.findOne({ email });
    if (ifEmailExists) {
      console.log("Email already registered");
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });
    console.log(newUser);
    // Respond with success
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logIn = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({
      success: false,
      message: "credential or password is incorrect"
    });
  }
  const user = await User.findOne({
      username: username 
  })
  console.log(user);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "email or username is incorrect"
    });

  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    return res.status(400).json({
      success: false,
      message: "Incorrect correct password"
    });
  }
  return res.status(200).json({
    success: true,
    message: "user verified",
    user
  })
  
  
};

const updateDetails = async(req,res) => {
  const { username, email, password, firstname, lastname, language, state } = req.body;

}



export { signUp,logIn };
