import Invited from "../../../models/SuperAdmin/saInvitedMember.js";
import Project from "../../../models/SuperAdmin/saNewProject.js";
import User from "../../../models/Client/userModels.js";

export const addMemberToProject = async (req, res) => {
    const { projectId, users } = req.body;


    if (!projectId || !Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ message: 'Invalid project ID or users array.' });
    }

    try {
        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            console.log('Project not found for ID:', projectId);
            return res.status(404).json({ message: 'Project not found.' });
        }
        

        // Update each Invited member to add the project ID to their projects array
        const result = await Invited.updateMany(
            { _id: { $in: users } }, // Match users by their IDs in the Invited model
            { $addToSet: { project: projectId } } // Add projectId to the projects array, avoiding duplicates
        );

        // Fetch the invited users to update their corresponding User model and Project schema
        const invitedUsers = await Invited.find({ _id: { $in: users } });

        // Update the User model and Project model for each invited user
        for (const invitedUser of invitedUsers) {
            // Find the corresponding user in the User model by email or another unique identifier
            const user = await User.findOne({ email: invitedUser.email });

            if (user) {
                // Add the project ID to the User model's projects array
                user.projects.addToSet(projectId); // Avoid duplicates with addToSet
                await user.save(); // Save the updated user

                // Add the user ID to the project's invitedUsers array
                project.invitedUsers.addToSet(user._id); // Avoid duplicates with addToSet
            } else {
                console.log(`User not found for email: ${invitedUser.email}`);
            }
        }

        // Save the updated project with the new invited users
        await project.save();
        console.log('Updated Project with invited users:', project);

        res.status(200).json({ message: 'Members added successfully and updated in both User and Project models.', invitedUsers });
    } catch (error) {
        console.error('Error adding members to project:', error);
        res.status(500).json({ message: 'An error occurred while adding members to the project.' });
    }
};
