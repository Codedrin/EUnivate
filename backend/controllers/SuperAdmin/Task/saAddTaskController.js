import saAddTask from "../../../models/SuperAdmin/saAddTask.js";
import Project from "../../../models/SuperAdmin/saNewProject.js";
import saInvitedMember from "../../../models/SuperAdmin/saInvitedMember.js";
import User from "../../../models/Client/userModels.js";
import { io } from "../../../index.js";

//getAddedMembers
export const getAddedMembers = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    // Fetching the project by ID
    const project = await Project.findById(projectId).populate(
      "invitedUsers",
      "username profilePicture"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      invitedUsers: project.invitedUsers.map((user) => ({
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
      })), // Return user details including the ID
    });
  } catch (error) {
    console.error("Error fetching invited users:", error); // Log the error
    res
      .status(500)
      .json({ message: "Server Error. Could not retrieve invited users." });
  }
};

// Create Task Controller
export const createTask = async (req, res) => {
  try {
    // Log the incoming request body
    // console.log('Request body:', req.body);

    const {
      taskName,
      assignee,
      startDate,
      dueDate,
      priority,
      status,
      description,
      objectives, // Array of { text: String, done: Boolean }
      questionUpdate,
      attachment,
      project,
    } = req.body;

    // Log the project ID to make sure it's coming correctly
    // console.log('Project ID:', project);

    // Fetch invited users for the project
    const invitedUsers = await saInvitedMember
      .find({ project })
      .select("userId");
    // console.log('Invited users for project:', invitedUsers);

    const invitedUserIds = invitedUsers.map((user) => user.userId.toString());
    // console.log('Invited user IDs:', invitedUserIds);

    // Check if all assignees are invited users
    const invalidAssignees = assignee.filter(
      (userId) => !invitedUserIds.includes(userId.toString())
    );
    // console.log('Invalid assignees:', invalidAssignees);

    if (invalidAssignees.length > 0) {
      console.log(
        "Some assignees are not invited members of this project:",
        invalidAssignees
      );
      return res.status(400).json({
        success: false,
        message: "Some assignees are not invited members of this project.",
        invalidAssignees,
      });
    }

    // Log the objectives for the task
    // console.log('Objectives before preparation:', objectives);

    // Prepare objectives with the default `done` status as false if not provided
    const preparedObjectives = objectives.map((obj) => ({
      text: obj.text,
      done: obj.done || false,
    }));

    // console.log('Prepared objectives:', preparedObjectives);

    // Create a new task document
    const newTask = new saAddTask({
      taskName,
      assignee,
      startDate,
      dueDate,
      priority,
      status,
      description,
      objectives: preparedObjectives,
      questionUpdate,
      attachment,
      project,
    });

    console.log("New task before saving:", newTask);

    // Save to the database
    const savedTask = await newTask.save();
    // console.log('Task saved successfully:', savedTask);

    res.status(201).json({
      success: true,
      message: "Task created successfully!",
      data: savedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not create task.",
      error: error.message,
    });
  }
};

// Get All Tasks Controller
export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required.",
      });
    }

    const query = { project: projectId };
    if (status) {
      query.status = status;
    }

    const tasks = await saAddTask
      .find(query)
      .populate("assignee", "name profilePicture")
      .populate({
        path: "assignee",
        match: { _id: { $in: invitedUserIds } }, // Ensure the assignees are part of invited users
        select: "name profilePicture",
      });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks by projectId:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not retrieve tasks.",
      error: error.message,
    });
  }
};

// Get Single Task by ID
export const getTaskById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query; // Read status from query parameters

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required.",
      });
    }

    // Build the query, including the status if provided
    const query = { project: projectId };
    if (status) {
      query.status = status; // Filter by status if provided
    }

    // Fetch tasks based on the query
    const tasks = await saAddTask
      .find(query)
      .populate("assignee", "name profilePicture");

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks by projectId:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not retrieve tasks.",
      error: error.message,
    });
  }
};

// Controller to fetch the task by project ID
export const getTasksByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query; // Read status from query parameters

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required.",
      });
    }

    // Build the query, including the status if provided
    const query = { project: projectId };
    if (status) {
      query.status = status; // Filter by status if provided
    }

    // Fetch tasks based on the query
    const tasks = await saAddTask
      .find(query)
      .populate("assignee", "username firstName lastName profilePicture")
      .populate("history.modifiedBy", "username profilePicture");
    // console.log('Tasks found:', tasks); // Debug log

    const tasksWithAdditionalInfo = tasks.map((task) => ({
      ...task._doc, // Spread the original task object
      doneObjectivesCount: task.objectives.filter((obj) => obj.done).length, // Count done objectives
      assignees: task.assignee.map((assignee) => ({
        username: assignee.username, // Store assignee's username
        profilePicture: assignee.profilePicture, // Store profile picture URL if needed
      })),
    }));

    // Return tasks, even if none are found
    res.status(200).json({
      success: true,
      data: tasksWithAdditionalInfo,
    });
  } catch (error) {
    console.error("Error fetching tasks by projectId:", error); // Debug log
    res.status(500).json({
      success: false,
      message: "Server Error. Could not retrieve tasks.",
      error: error.message,
    });
  }
};

export const updateTaskObjectives = async (req, res) => {
  try {
    const { id } = req.params; // Task ID
    const { objectives } = req.body; // Only objectives should be updated

    if (!objectives || !Array.isArray(objectives)) {
      return res.status(400).json({
        success: false,
        message:
          "Objectives must be an array and are required for this operation.",
      });
    }

    // Update only the objectives field in the task document
    const updatedTask = await saAddTask.findByIdAndUpdate(
      id,
      { $set: { objectives } }, // Only update the objectives field
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Emit the task-updated event for real-time updates (if using Socket.IO)
    io.emit("task-updated", updatedTask);

    res.status(200).json({
      message: "Task objectives updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task objectives:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not update task objectives.",
      error: error.message,
    });
  }
};

// Update Task Controller
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params; // Extract the task ID  from the URL parameters
    const userId = req.body.modifiedBy; // Get the user ID who is modifying the task

    // Log the user ID who is modifying the task
    console.log(`Task is being modified by user with ID: ${userId}`);

    const updatedData = req.body; // Get the new task data from the request body

    // Find the existing task by ID (this is required to compare the changes)
    const task = await saAddTask
      .findById(id)
      .populate("assignee", "username profilePicture");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Initialize an object to track changes
    const changes = {};

    // Loop through the updatedData keys
    for (let key in updatedData) {
      if (updatedData.hasOwnProperty(key)) {
        switch (key) {
          case "taskName":
            if (updatedData[key] !== task.taskName) {
              changes.taskName = updatedData[key];
            }
            break;
          case "description":
            if (updatedData[key] !== task.description) {
              changes.description = updatedData[key];
            }
            break;
          case "objectives":
            if (
              JSON.stringify(updatedData[key]) !==
              JSON.stringify(task.objectives)
            ) {
              changes.objectives = updatedData[key];
            }
            break;
          case "priority":
            if (updatedData[key] !== task.priority) {
              changes.priority = updatedData[key];
            }
            break;
          case "status":
            if (updatedData[key] !== task.status) {
              changes.status = updatedData[key];
            }
            break;
          case "startDate":
            if (updatedData[key] !== task.startDate) {
              changes.startDate = updatedData[key];
            }
            break;
          case "dueDate":
            if (updatedData[key] !== task.dueDate) {
              changes.dueDate = updatedData[key];
            }
            break;
          case "attachment":
            if (
              JSON.stringify(updatedData[key]) !==
              JSON.stringify(task.attachment)
            ) {
              changes.attachment = updatedData[key];
            }
          case "assignee":
            if (
              JSON.stringify(updatedData[key]) !== JSON.stringify(task.assignee)
            ) {
              // Fetch full assignee information (with usernames) for history storage
              const fullAssignees = await User.find({
                _id: { $in: updatedData[key] },
              }).select("username");

              changes.assignee = fullAssignees; // Store the array of assignee objects with usernames
            }
            break;
          default:
            break;
        }
      }
    }

    // Log changes in the task history if there are any
    if (Object.keys(changes).length > 0) {
      task.history.push({
        modifiedBy: userId, // The user who modified the task
        modifiedAt: new Date(), // Timestamp of the change
        changes: JSON.stringify(changes), // Log the changes made as a JSON string
      });
      // Save the task with the updated history
      await task.save();
    }

    // Now, perform the actual update in the database
    const updatedTask = await saAddTask
      .findByIdAndUpdate(
        id,
        { $set: changes },
        { new: true, runValidators: true } // Return the updated document
      )
      .populate("assignee", "username profilePicture");

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      message: "Server error. Could not update task.",
      error: error.message,
    });
  }
};

// Delete Task Controller
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await saAddTask.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Task deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error. Could not delete task.",
      error: error.message,
    });
  }
};

// Controller to add a comment to a task
export const addCommentToTask = async (req, res) => {
  try {
    const { taskId } = req.params; // Get task ID from URL
    const { userId, text } = req.body; // Only receive userId and text from the request

    console.log("Received taskId:", taskId);
    console.log("Received userId:", userId);
    console.log("Received comment text:", text);

    if (!taskId || !userId || !text) {
      console.log("Missing required fields.");
      return res.status(400).json({
        success: false,
        message: "Task ID, user ID, and comment text are required.",
      });
    }

    // Find the user to get the userName and profilePicture
    const user = await User.findById(userId).select("username profilePicture");
    console.log("Fetched user:", user);

    if (!user) {
      console.log("User not found.");
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find the task and add the comment with the fetched user details
    const updatedTask = await saAddTask.findByIdAndUpdate(
      taskId,
      {
        $push: {
          comments: {
            userId,
            userName: user.username,
            profilePicture: user.profilePicture,
            text,
          },
        },
      },
      { new: true, runValidators: true } // Return the updated document
    );

    console.log("Updated task:", updatedTask);

    if (!updatedTask) {
      console.log("Task not found.");
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTask.comments, // Return the updated comments array
    });
  } catch (error) {
    console.error("Error adding comment to task:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not add comment.",
      error: error.message,
    });
  }
};

//GetComments
export const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await saAddTask.findById(taskId).select("comments");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: task.comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not fetch comments.",
      error: error.message,
    });
  }
};

// Delete Task Controller
export const deleteTaskKanban = async (req, res) => {
  try {
    const { taskId } = req.params; // Task ID from the URL
    console.log("Received taskId:", taskId); // Log received task ID

    // Check if task exists before attempting deletion
    const task = await saAddTask.findByIdAndDelete(taskId);
    console.log("Task fetched for deletion:", task); // Log task fetched

    if (!task) {
      console.warn("Task not found for ID:", taskId); // Warn if task is not found
      return res.status(404).json({ message: "Task not found" });
    }

    // Emit socket event to notify clients about task deletion
    console.log("Emitting task-deleted event for taskId:", taskId);
    io.emit("task-deleted", taskId); // Send taskId to inform clients

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error); // Log the error stack trace
    res.status(500).json({
      success: false,
      message: "Server Error. Could not delete task.",
      error: error.message,
    });
  }
};

