import express from "express";
import { authmiddleware,isAdminmiddleware } from "../middleware/auth-middleware.js";

import { createTask,getTasks,getcompletedtasks, getinprogresstasks, gettodotasks, getTrashTasks, trashthetask, restoretask, deletetask, fetchdashboard } from "../controllers/Taskcontroller.js";



const router = express.Router();

router.post("/createtask",authmiddleware,isAdminmiddleware,createTask);

router.get("/gettasks",authmiddleware,getTasks);

router.get("/getcompletedtasks",authmiddleware,getcompletedtasks);


router.get("/getinprogresstasks",authmiddleware,getinprogresstasks);

router.get("/gettodotasks",authmiddleware,gettodotasks);

router.get("/gettrashtasks",authmiddleware,isAdminmiddleware,getTrashTasks);

router.post("/trashthetask",authmiddleware,isAdminmiddleware,trashthetask);

router.post("/restoretask",authmiddleware,isAdminmiddleware,restoretask);

router.delete("/deletetask",authmiddleware,isAdminmiddleware,deletetask);

router.get("/fetchdashboard",authmiddleware,fetchdashboard);

export default router;