import User from "../models/User-model.js";
// import mongoose from "mongoose";
import { Team } from "../models/User-model.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = "TaskManager"; // Replace with your secure secret key

const loginUser = async (req, res) => {
    try {   
        console.log("chandu");
        const { email, password } = req.body;

        console.log(email + " " + password);

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required." });
        }

        // Find user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        // Directly compare passwords (Consider using hashed passwords in production)
        if (user.password !== password) {
            return res.status(401).send({ message: "Invalid credentials." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email,isAdmin:user.isAdmin }, // Payload
            SECRET_KEY, // Secret Key
            { expiresIn: "10h" } // Token Expiration
        );

        // Respond with success message, token, and user data
        res.status(200).send({
            message: "Login successful.",
            token: token,
            user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
};

const Userdata = async (req, res) => {
  try {

    const email = req.user.email;

    // Use `await` to resolve the promise from `findOne`
    const userdetails = await User.findOne({ email });

    // console.log("Retrieved user details:", userdetails);
    if (!userdetails) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Message sent successfully",
      user: userdetails, // Send the user details in the response
    });
  } catch (error) {
    console.error("Error retrieving user details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const inserUsers = async () => {
    try {
        // Define 15 users, with 5 admins and 10 regular users
        const users = [
            { 
                name: "Admin1", 
                title: "Manager", 
                role: "Admin", 
                email: "admin1@example.com", 
                password: "password1", 
                isAdmin: true, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "Admin2", 
                title: "Manager", 
                role: "Admin", 
                email: "admin2@example.com", 
                password: "password2", 
                isAdmin: true, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "Admin3", 
                title: "Manager", 
                role: "Admin", 
                email: "admin3@example.com", 
                password: "password3", 
                isAdmin: true, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "Admin4", 
                title: "Manager", 
                role: "Admin", 
                email: "admin4@example.com", 
                password: "password4", 
                isAdmin: true, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "Admin5", 
                title: "Manager", 
                role: "Admin", 
                email: "admin5@example.com", 
                password: "password5", 
                isAdmin: true, 
                team: null, 
                tasks: [], 
                isActive: true
            },

            { 
                name: "User1", 
                title: "Developer", 
                role: "User", 
                email: "user1@example.com", 
                password: "password6", 
                isAdmin: false, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "User2", 
                title: "Developer", 
                role: "User", 
                email: "user2@example.com", 
                password: "password7", 
                isAdmin: false, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "User3", 
                title: "Developer", 
                role: "User", 
                email: "user3@example.com", 
                password: "password8", 
                isAdmin: false, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "User4", 
                title: "Developer", 
                role: "User", 
                email: "user4@example.com", 
                password: "password9", 
                isAdmin: false, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "User5", 
                title: "Developer", 
                role: "User", 
                email: "user5@example.com", 
                password: "password10", 
                isAdmin: false, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "User6", 
                title: "Developer", 
                role: "User", 
                email: "user6@example.com", 
                password: "password11", 
                isAdmin: false, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "User7", 
                title: "Developer", 
                role: "User", 
                email: "user7@example.com", 
                password: "password12", 
                isAdmin: false, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "User8", 
                title: "Developer", 
                role: "User", 
                email: "user8@example.com", 
                password: "password13", 
                isAdmin: false, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "User9", 
                title: "Developer", 
                role: "User", 
                email: "user9@example.com", 
                password: "password14", 
                isAdmin: false, 
                team: null, 
                tasks: [], 
                isActive: true
            },
            { 
                name: "User10", 
                title: "Developer", 
                role: "User", 
                email: "user10@example.com", 
                password: "password15", 
                isAdmin: false, 
                team: null, 
                tasks: [], 
                isActive: true
            },
        ];

        // Insert the users into the database
        await User.insertMany(users);

        console.log("Users inserted successfully.");
    } catch (error) {
        console.error("Error inserting users:", error);
    }
};

const getTeam = async (req, res) => {
    try {
      const { email } = req.user; // Extract the email from the authenticated user
      const USER = await User.findOne({ email }); // Find the user based on the email
  
      if (!USER) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const team = await Team.findOne({ admin: USER._id }); // Find the team where the user is the admin
  
      if (!team) {
        return res.status(404).json({ message: "Team not found." });
      }
  
      const memberIds = team.members; // Array of member IDs

      const membersforteam = await User.find({ _id: { $in: memberIds } }); // Find all users
      const memberDetails = await User.find({ _id: { $in: memberIds } }, "name"); // Retrieve names of members
  
      const members = memberDetails.map((member) => member.name); // Extract just the names

      console.log(members);

      console.log("For team page:",membersforteam);
  
      // Send the team data along with member names
      res.status(200).json({ members,membersforteam });
    } catch (err) {
      console.error("There was an error getting the team members:", err); // Log the error for debugging
      res.status(500).json({ message: "An error occurred while fetching the team." }); // Send a 500 status for server error
    }
};


const insertMember = async (req, res) => {
    try {
        // Extract member details from request body
        const { name, title, role, email, password } = req.body;

        // Extract admin's email from the request

        console.log(req.user.id);
        const adminid = req.user.id;


        // Find the admin
        const admin = await User.findOne({ _id:adminid });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Find the team associated with the admin
        const team = await Team.findOne({ admin: admin._id });

        if (!team) {
            return res.status(404).json({ message: "Team not found for the admin" });
        }

        // Create a new member
        const newMember = new User({
            name,
            title,
            role,
            email,
            password,
            team: team._id, // Associate the new member with the team
        });

        // Save the new member to the database
        const savedMember = await newMember.save();

        // Add the new member's ObjectId to the team's members array
        team.members.push(savedMember._id);

        // Save the updated team
        await team.save();

        res.status(201).json({
            message: "Member added successfully",
            member: savedMember,
            team: team,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};









    
export { loginUser,Userdata,inserUsers,getTeam,insertMember};
