import saAddTask from '../../../models/SuperAdmin/saAddTask.js'; 
import Project from '../../../models/SuperAdmin/saNewProject.js';
import saInvitedMember from '../../../models/SuperAdmin/saInvitedMember.js';

          //getAddedMembers
        export const getAddedMembers = async (req, res) => {
          try {
              const { projectId } = req.query;


              if (!projectId) {
                  return res.status(400).json({ message: 'Project ID is required' });
              }

              // Fetching the project by ID
              const project = await Project.findById(projectId).populate('invitedUsers', 'username profilePicture');

              if (!project) {
                  return res.status(404).json({ message: 'Project not found' });
              }


              res.status(200).json({
                  success: true,
                  invitedUsers: project.invitedUsers.map(user => ({
                      id: user._id,
                      username: user.username,
                      profilePicture: user.profilePicture
                  })) // Return user details including the ID
              });
          } catch (error) {
              console.error('Error fetching invited users:', error); // Log the error
              res.status(500).json({ message: 'Server Error. Could not retrieve invited users.' });
          }
        };


       // Create Task Controller
       export const createTask = async (req, res) => {
        try {
          const {
            taskName, 
            assignee, 
            startDate, 
            dueDate, 
            priority, 
            status, 
            description, 
            objectives,  // Array of { text: String, done: Boolean }
            questionUpdate, 
            attachment,
            project 
          } = req.body;
      
          // Fetch invited users for the project
          const invitedUsers = await saInvitedMember.find({ project }).select('userId');
          const invitedUserIds = invitedUsers.map(user => user.userId.toString());
      
          // Check if all assignees are invited users
          const invalidAssignees = assignee.filter(userId => !invitedUserIds.includes(userId.toString()));
      
          if (invalidAssignees.length > 0) {
            return res.status(400).json({
              success: false,
              message: 'Some assignees are not invited members of this project.',
              invalidAssignees
            });
          }
      
          // Prepare objectives with the default `done` status as false if not provided
          const preparedObjectives = objectives.map(obj => ({
            text: obj.text,
            done: obj.done || false
          }));
      
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
      
          // Save to the database
          const savedTask = await newTask.save();
      
          res.status(201).json({
            success: true,
            message: 'Task created successfully!',
            data: savedTask
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            success: false,
            message: 'Server Error. Could not create task.',
            error: error.message
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
                message: 'Project ID is required.'
              });
            }

            const query = { project: projectId };
            if (status) {
              query.status = status;
            }

            const tasks = await saAddTask.find(query)
              .populate('assignee', 'name profilePicture')
              .populate({
                path: 'assignee',
                match: { _id: { $in: invitedUserIds } },  // Ensure the assignees are part of invited users
                select: 'name profilePicture'
              });

            res.status(200).json({
              success: true,
              data: tasks
            });
          } catch (error) {
            console.error('Error fetching tasks by projectId:', error);
            res.status(500).json({
              success: false,
              message: 'Server Error. Could not retrieve tasks.',
              error: error.message
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
              message: 'Project ID is required.'
            });
          }

          // Build the query, including the status if provided
          const query = { project: projectId };
          if (status) {
            query.status = status; // Filter by status if provided
          }

          // Fetch tasks based on the query
          const tasks = await saAddTask.find(query)
            .populate('assignee', 'name profilePicture');

          res.status(200).json({
            success: true,
            data: tasks
          });
        } catch (error) {
          console.error('Error fetching tasks by projectId:', error);
          res.status(500).json({
            success: false,
            message: 'Server Error. Could not retrieve tasks.',
            error: error.message
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
                message: 'Project ID is required.'
              });
            }

            // Build the query, including the status if provided
            const query = { project: projectId };
            if (status) {
              query.status = status; // Filter by status if provided
            }

            // Fetch tasks based on the query
            const tasks = await saAddTask.find(query).populate('assignee', 'name profilePicture');
            console.log('Tasks found:', tasks); // Debug log

            // Return tasks, even if none are found
            res.status(200).json({
              success: true,
              data: tasks
            });
          } catch (error) {
            console.error('Error fetching tasks by projectId:', error); // Debug log
            res.status(500).json({
              success: false,
              message: 'Server Error. Could not retrieve tasks.',
              error: error.message
            });
          }
        };

      // Update Task Controller
      export const updateTask = async (req, res) => {
        try {
          const { id } = req.params; // Extract the task ID from the URL parameters
          const updatedData = req.body;
          const {
            taskName,
            description,
            objectives,
            priority,
            status,
            startDate,
            dueDate,
            attachment,
          } = req.body; // Extract the task details from the request body
      
          // Find the task by ID and update it with the new values
          const updatedTask = await saAddTask.findByIdAndUpdate(
            id,
            {
              taskName,
              description,
              objectives,
              priority,
              status,
              startDate,
              dueDate,
              attachment,
            },
            { new: true, runValidators: true } // Return the updated document
          );
      
          if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
          }
      
          res.status(200).json({ message: 'Task updated successfully', data: updatedTask });
        } catch (error) {
          console.error('Error updating task:', error);
          res.status(500).json({ message: 'Server error. Could not update task.', error: error.message });
        }
      };

// Delete Task Controller
export const deleteTask = async (req, res) => {
  try {
     const deletedTask = await saAddTask.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error. Could not delete task.',
      error: error.message
    });
  }
};

