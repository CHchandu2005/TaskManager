import Task from "../models/Task-model.js";
import User from "../models/User-model.js";
import { Team } from "../models/User-model.js";

const createTask = async (req, res) => {
  try {
    // Extract data from the request body
    const { title, description, due_date, priority, stage, Assigned_to } = req.body;
    const Created_by = req.user.id;

    // Check if Assigned_to contains names
    if (!Array.isArray(Assigned_to) || Assigned_to.length === 0) {
      return res.status(400).json({ message: "Assigned_to must be a non-empty array of user names" });
    }

    // Retrieve user IDs from the User collection
    const assignedUsers = await User.find({ name: { $in: Assigned_to } }).select('_id');
    if (assignedUsers.length !== Assigned_to.length) {
      return res.status(404).json({
        message: "One or more users in Assigned_to were not found",
      });
    }

    // Extract only the IDs of the users
    const assignedUserIds = assignedUsers.map(user => user._id);

    // Create a new task
    const newTask = new Task({
      title,
      description,
      due_date,
      priority,
      stage,
      Created_by,
      Assigned_to: assignedUserIds, // Store user IDs in the Assigned_to field
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Update the Created_by user to add the task ID to their tasks array
    await User.updateOne(
      { _id: Created_by },
      { $push: { tasks: savedTask._id } } // Push the task ID to the tasks array
    );

    // Update all assigned users to add the task ID to their tasks array
    await User.updateMany(
      { _id: { $in: assignedUserIds } },
      { $push: { tasks: savedTask._id } } // Push the task ID to the tasks array for each assigned user
    );

    // Respond with the saved task data
    res.status(201).json({
      message: "Task created successfully and updated in user collections",
      task: savedTask,
    });
  } catch (err) {
    console.error("Error in creating the task", err);
    res.status(500).json({
      message: "Error in creating the task",
      error: err.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user's ID from the request

    // Check if the user is an admin
    const user = await User.findById(userId).select('isAdmin');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let taskOwnerId; // This will store the ID whose tasks we need to fetch

    if (user.isAdmin) {
      // If the user is an admin, retrieve their tasks
      taskOwnerId = userId;
    } else {
      // If the user is not an admin, find their team's admin
      const team = await Team.findOne({ members: userId }).populate('admin');
      if (!team) {
        return res.status(404).json({ message: "Team not found for the user" });
      }
      taskOwnerId = team.admin._id; // Admin's ID
    }

    // Retrieve the task owner's tasks array from the User collection
    const taskOwner = await User.findById(taskOwnerId).select('tasks');
    if (!taskOwner || taskOwner.tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    // Use the task IDs to retrieve task details from the Task collection
    const tasks = await Task.find({
      _id: { $in: taskOwner.tasks },
      isTrashed: false, // Exclude trashed tasks
    });

    // Populate Assigned_to field and format due_date
    const taskWithDetails = await Promise.all(tasks.map(async (task) => {
      const assignedUsers = await User.find({ '_id': { $in: task.Assigned_to } }).select('name');
      const assignedUserNames = assignedUsers.map(u => u.name);
      const dueDateString = task.due_date ? task.due_date.toISOString().split('T')[0] : null;

      return {
        ...task.toObject(),
        Assigned_to: assignedUserNames,
        due_date: dueDateString, // Adding the due_date as a string
      };
    }));

    // Respond with the list of tasks
    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks: taskWithDetails,
    });
  } catch (err) {
    console.error("Error in retrieving tasks", err);
    res.status(500).json({
      message: "Error in retrieving tasks",
      error: err.message,
    });
  }
};


const getcompletedtasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user's ID from the request

    // Check if the user is an admin
    const user = await User.findById(userId).select('isAdmin');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let taskOwnerId; // This will store the ID whose tasks we need to fetch

    if (user.isAdmin) {
      // If the user is an admin, retrieve their tasks
      taskOwnerId = userId;
    } else {
      // If the user is not an admin, find their team's admin
      const team = await Team.findOne({ members: userId }).populate('admin');
      if (!team) {
        return res.status(404).json({ message: "Team not found for the user" });
      }
      taskOwnerId = team.admin._id; // Admin's ID
    }

    // Retrieve the user's tasks array from the User collection
    const taskOwner = await User.findById(taskOwnerId).select('tasks');
    if (!taskOwner || taskOwner.tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    // Retrieve only completed and non-trashed tasks from the Task collection
    const completedTasks = await Task.find({
      _id: { $in: taskOwner.tasks },
      stage: "completed",
      isTrashed: false, // Filter for completed and non-trashed tasks
    });

    if (completedTasks.length === 0) {
      return res.status(404).json({ message: "No completed tasks found" });
    }

    // Populate Assigned_to field and format due_date
    const taskWithDetails = await Promise.all(completedTasks.map(async (task) => {
      const assignedUsers = await User.find({ '_id': { $in: task.Assigned_to } }).select('name');
      const assignedUserNames = assignedUsers.map(u => u.name);
      const dueDateString = task.due_date ? task.due_date.toISOString().split('T')[0] : null;

      return {
        ...task.toObject(),
        Assigned_to: assignedUserNames,
        due_date: dueDateString, // Adding the due_date as a string
      };
    }));

    // Respond with the list of completed tasks
    res.status(200).json({
      message: "Completed tasks retrieved successfully",
      tasks: taskWithDetails,
    });
  } catch (err) {
    console.error("Error in retrieving completed tasks", err);
    res.status(500).json({
      message: "Error in retrieving completed tasks",
      error: err.message,
    });
  }
};


const getinprogresstasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user's ID from the request

    // Check if the user is an admin
    const user = await User.findById(userId).select('isAdmin');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let taskOwnerId; // This will store the ID whose tasks we need to fetch

    if (user.isAdmin) {
      // If the user is an admin, retrieve their tasks
      taskOwnerId = userId;
    } else {
      // If the user is not an admin, find their team's admin
      const team = await Team.findOne({ members: userId }).populate('admin');
      if (!team) {
        return res.status(404).json({ message: "Team not found for the user" });
      }
      taskOwnerId = team.admin._id; // Admin's ID
    }

    // Retrieve the task owner's tasks array from the User collection
    const taskOwner = await User.findById(taskOwnerId).select('tasks');
    if (!taskOwner || taskOwner.tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    // Use the task IDs to retrieve only "in progress" tasks from the Task collection
    const inProgressTasks = await Task.find({
      _id: { $in: taskOwner.tasks },
      stage: "in progress",
      isTrashed: false, // Exclude trashed tasks
    });

    if (inProgressTasks.length === 0) {
      return res.status(404).json({ message: "No in-progress tasks found" });
    }

    // Populate Assigned_to field and format due_date
    const taskWithDetails = await Promise.all(inProgressTasks.map(async (task) => {
      const assignedUsers = await User.find({ '_id': { $in: task.Assigned_to } }).select('name');
      const assignedUserNames = assignedUsers.map(u => u.name);
      const dueDateString = task.due_date ? task.due_date.toISOString().split('T')[0] : null;

      return {
        ...task.toObject(),
        Assigned_to: assignedUserNames,
        due_date: dueDateString, // Adding the due_date as a string
      };
    }));

    // Respond with the list of in-progress tasks
    res.status(200).json({
      message: "In-progress tasks retrieved successfully",
      tasks: taskWithDetails,
    });
  } catch (err) {
    console.error("Error in retrieving in-progress tasks", err);
    res.status(500).json({
      message: "Error in retrieving in-progress tasks",
      error: err.message,
    });
  }
};


const gettodotasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user's ID from the request

    // Check if the user is an admin
    const user = await User.findById(userId).select('isAdmin');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let taskOwnerId; // This will store the ID whose tasks we need to fetch

    if (user.isAdmin) {
      // If the user is an admin, retrieve their tasks
      taskOwnerId = userId;
    } else {
      // If the user is not an admin, find their team's admin
      const team = await Team.findOne({ members: userId }).populate('admin');
      if (!team) {
        return res.status(404).json({ message: "Team not found for the user" });
      }
      taskOwnerId = team.admin._id; // Admin's ID
    }

    // Retrieve the task owner's tasks array from the User collection
    const taskOwner = await User.findById(taskOwnerId).select('tasks');
    if (!taskOwner || taskOwner.tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    // Use the task IDs to retrieve only "todo" tasks from the Task collection
    const todoTasks = await Task.find({
      _id: { $in: taskOwner.tasks },
      stage: "todo",
      isTrashed: false, // Exclude trashed tasks
    });

    if (todoTasks.length === 0) {
      return res.status(404).json({ message: "No todo tasks found" });
    }

    // Populate Assigned_to field and format due_date
    const taskWithDetails = await Promise.all(todoTasks.map(async (task) => {
      const assignedUsers = await User.find({ '_id': { $in: task.Assigned_to } }).select('name');
      const assignedUserNames = assignedUsers.map(u => u.name);
      const dueDateString = task.due_date ? task.due_date.toISOString().split('T')[0] : null;

      return {
        ...task.toObject(),
        Assigned_to: assignedUserNames,
        due_date: dueDateString, // Adding the due_date as a string
      };
    }));

    // Respond with the list of todo tasks
    res.status(200).json({
      message: "Todo tasks retrieved successfully",
      tasks: taskWithDetails,
    });
  } catch (err) {
    console.error("Error in retrieving todo tasks", err);
    res.status(500).json({
      message: "Error in retrieving todo tasks",
      error: err.message,
    });
  }
};


const getTrashTasks = async (req, res) => {
  try {
    // Get the user's ID from the request
    const userId = req.user.id;

    // Retrieve the user's tasks array from the User collection
    const user = await User.findById(userId).select('tasks');
    if (!user || user.tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    // Use the task IDs to retrieve only trashed tasks from the Task collection
    const trashedTasks = await Task.find({
      _id: { $in: user.tasks },
      isTrashed: true, // Filter for trashed tasks
    });

    if (trashedTasks.length === 0) {
      return res.status(404).json({ message: "No trashed tasks found" });
    }

    // Get the user names for the Assigned_to field and format the due_date
    const taskWithDetails = await Promise.all(trashedTasks.map(async (task) => {
      // Retrieve the user object for the assigned user(s)
      const assignedUsers = await User.find({ '_id': { $in: task.Assigned_to } }).select('name');

      // Map user names to the Assigned_to field
      const assignedUserNames = assignedUsers.map(u => u.name);

      // Format the due_date to a readable string
      const dueDateString = task.due_date ? task.due_date.toISOString().split('T')[0] : null;

      // Return the task with updated Assigned_to and due_date fields
      return {
        ...task.toObject(),
        Assigned_to: assignedUserNames,
        due_date: dueDateString, // Adding the due_date as a string
      };
    }));

    // Respond with the list of trashed tasks with user names and formatted due_date
    res.status(200).json({
      message: "Trashed tasks retrieved successfully",
      tasks: taskWithDetails,
    });
  } catch (err) {
    console.error("Error in retrieving trashed tasks", err);
    res.status(500).json({
      message: "Error in retrieving trashed tasks",
      error: err.message,
    });
  }
};


const trashthetask = async (req, res) => {
  try {
    const taskId = req.body.taskId; // Extract taskId from the request body

    // Check if taskId is provided
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    // Update the Task document's isTrashed field to true
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { isTrashed: true },
      { new: true } // Return the updated document
    );

    // Check if the task was found and updated
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Respond with the updated task
    res.status(200).json({ message: 'Task trashed successfully', task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while trashing the task' });
  }
};


const restoretask = async (req, res) => {
  try {
    const taskId = req.body.taskId; // Extract taskId from the request body
    // Check if taskId is provided
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
    // Update the Task document's isTrashed field to false
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { isTrashed: false },
      { new: true } // Return the updated document
    );
    // Check if the task was found and updated
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    // Respond with the updated task
    res.status(200).json({ message: 'Task restored successfully', task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while restoring the task' });
  }
};


const deletetask = async (req, res) => {
  try {
    const taskId = req.body.taskId; // Extract taskId from the request body

    // Check if taskId is provided
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    // Delete the Task document
    const deletedTask = await Task.findByIdAndDelete(taskId);

    // Check if the task was found and deleted
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Remove the taskId from the tasks array in the related User document(s)
    await User.updateMany(
      { tasks: taskId }, // Find users with this taskId
      { $pull: { tasks: taskId } } // Remove the taskId from the tasks array
    );

    // Respond with a success message
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the task' });
  }
};


const fetchdashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve user details to check if the user is an admin
    const user = await User.findById(userId).select("isAdmin");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let taskOwnerId;

    // Determine the task owner ID based on user role
    if (user.isAdmin) {
      // If the user is an admin, use their ID
      taskOwnerId = userId;
    } else {
      // If the user is not an admin, find their team's admin
      const team = await Team.findOne({ members: userId }).populate("admin");
      if (!team) {
        return res.status(404).json({ message: "Team not found for the user" });
      }
      taskOwnerId = team.admin._id; // Admin's ID
    }

    // Retrieve all task IDs associated with the task owner
    const taskOwner = await User.findById(taskOwnerId).select("tasks").populate("tasks");
    if (!taskOwner || !taskOwner.tasks) {
      return res.status(404).json({ message: "Tasks not found for the user" });
    }

    // Extract all tasks from the User document, excluding trashed tasks
    const tasks = taskOwner.tasks.filter(task => !task.isTrashed);

    // Calculate task counts and priority levels
    const totalTasksCount = tasks.length;
    const todoTasksCount = tasks.filter(task => task.stage === "todo").length;
    const completedTasksCount = tasks.filter(task => task.stage === "completed").length;
    const inProgressTasksCount = tasks.filter(task => task.stage === "in progress").length;
    const highPriorityCount = tasks.filter(task => task.priority === "high").length;
    const mediumPriorityCount = tasks.filter(task => task.priority === "medium").length;
    const lowPriorityCount = tasks.filter(task => task.priority === "low").length;

    // Return the aggregated data in the response
    return res.status(200).json({
      totalTasksCount,
      todoTasksCount,
      completedTasksCount,
      inProgressTasksCount,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    return res.status(500).json({ message: "Server error while fetching dashboard data" });
  }
};






export { createTask, getTasks, getcompletedtasks, getinprogresstasks, gettodotasks, getTrashTasks, trashthetask, restoretask, deletetask, fetchdashboard };