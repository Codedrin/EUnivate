import User from "../../../models/Client/userModels.js";
import Project from "../../../models/SuperAdmin/saNewProject.js";

export const assignProjectToUser = async (req, res) => {
    const { userId, projectId, updateData } = req.body; // Assuming updateData is the new data for the project

    try {
        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update the project if updateData is provided
        if (updateData) {
            const updatedProject = await Project.findByIdAndUpdate(projectId, updateData, { new: true });
            if (!updatedProject) {
                return res.status(404).json({ message: 'Failed to update project' });
            }
        }

        // Update the user
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { projects: projectId } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Project assigned successfully', user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
