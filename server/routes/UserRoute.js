import express from "express";
import { inserUsers, loginUser,Userdata,getTeam,insertMember } from "../controllers/Usercontroller.js";


import { authmiddleware,isAdminmiddleware } from "../middleware/auth-middleware.js";



const router = express.Router();

router.post("/login",loginUser);

router.get("/user", authmiddleware, Userdata);

router.post("/insertitems",inserUsers);

router.get("/teamMembers",authmiddleware,isAdminmiddleware,getTeam);

router.post("/insertMember",authmiddleware,isAdminmiddleware,insertMember);


export default router;