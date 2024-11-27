import SaNewProject from '../../../models/SuperAdmin/saNewProject.js';
import Workspace from '../../../models/SuperAdmin/addWorkspaceModel.js';
import User from '../../../models/Client/userModels.js';


export const createSaNewProject = async (req, res) => {
    try {
      const { projectName, thumbnail, invitedUsers, workspaceId } = req.body;

        if (!projectName || !thumbnail || !workspaceId || !req.user) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newSaNewProject = new SaNewProject({
            projectName,
            thumbnail,
            workspaceId,  
            owner: req.user._id,  
            invitedUsers
        });

      
        const savedSaNewProject = await newSaNewProject.save();
        return res.status(201).json(savedSaNewProject);
    } catch (error) {
        
        console.error("Error in createSaNewProject:", error);

        return res.status(500).json({
            error: error.message || 'An error occurred while creating the SaNewProject'
        });
    }
};

export const getAllProjects = async (req, res) => {
  try {
      const { workspaceId } = req.query;

      // Construct query to fetch projects based on workspaceId or all projects if no workspaceId is provided
      const query = { owner: req.user._id };
      if (workspaceId) {
          query.workspaceId = workspaceId;
      }

      // Fetch both owned and invited projects matching the query
      const ownedProjects = await SaNewProject.find(query)
          .populate('invitedUsers', 'username firstName lastName profilePicture')
          .populate('workspaceId', 'workspaceTitle');

      const invitedProjects = await SaNewProject.find({
          invitedUsers: req.user._id,
          ...(workspaceId ? { workspaceId } : {})
      })
          .populate('invitedUsers', 'username firstName lastName  profilePicture')
          .populate('workspaceId', 'workspaceTitle');

      // Combine owned and invited projects
      const allProjects = [...ownedProjects, ...invitedProjects];

      // Remove duplicates using a Map to ensure each project appears only once
      const uniqueProjects = Array.from(
          new Map(allProjects.map(project => [project._id.toString(), project])).values()
      );

      
      if (uniqueProjects.length === 0) {
          return res.status(404).json({ message: 'No projects found' });
      }

      return res.status(200).json(uniqueProjects);
  } catch (error) {
      console.error("Error in fetching projects:", error.message);
      return res.status(500).json({ error: error.message || 'An error occurred while fetching the projects' });
  }
};


  
  
  
//Get Project by id
export const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;    

        // Fetch project by ID from the database
        const project = await SaNewProject.findById(projectId)
        .populate('invitedUsers', 'username profilePicture') // Populate invitedUsers with username and profilePicture
        .exec();

        // Check if project exists
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        return res.status(200).json(project);
    } catch (error) {
        console.error("Error in fetching project:", error.message);
        return res.status(500).json({ error: error.message || 'An error occurred while fetching the project' });
    }
};

export const inviteUsersToProject = async (req, res) => {
  try {
    const { projectId, users } = req.body;

    // Validate input
    if (!Array.isArray(users) || !projectId) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const project = await SaNewProject.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const alreadyInvited = users.filter(userId => 
      project.invitedUsers.includes(userId)
    );

    if (alreadyInvited.length > 0) {
      return res.status(400).json({ message: 'Some users are already invited.' });
    }

    // Check if current user is the owner
    if (!req.user || project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to invite users to this project' });
    }

    // Add user IDs directly to the invitedUsers array
    project.invitedUsers = [...new Set([...project.invitedUsers, ...users])]; // Prevent duplicates

    // Save the project
    await project.save();

    // Add users to workspace
    await Workspace.updateOne(
      { _id: project.workspaceId }, 
      { $addToSet: { users: { $each: users } } } // Add each user to the workspace
    );

    return res.status(200).json(project);
  } catch (error) {
    console.error("Error in inviting users:", error.message);
    return res.status(500).json({ error: error.message || 'An error occurred while inviting users' });
  }
};


// Delete project and remove the project from associated users' project lists
export const deleteSaNewProject = async (req, res) => {
  const { projectId } = req.params;  // Get projectId from request params

  try {
    // Find the project to be deleted
    const project = await SaNewProject.findById(projectId).populate('invitedUsers');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Remove the project from all invited users' projects list
    const invitedUsers = project.invitedUsers;
    await Promise.all(
      invitedUsers.map(async (user) => {
        await User.findByIdAndUpdate(user._id, {
          $pull: { projects: project._id }  // Remove project from users' projects array
        });
      })
    );

    // Delete the project from the database
    await SaNewProject.findByIdAndDelete(projectId);

    return res.status(200).json({ message: 'Project and associations deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ message: 'An error occurred while deleting the project' });
  }
};