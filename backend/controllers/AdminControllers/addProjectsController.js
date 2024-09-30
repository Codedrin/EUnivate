import Project from "../../models/Admin/addProjects.js";

const createProject = async (req, res) => {
  try {
    const { projectName, teamMembers, adviser, description, image } = req.body;

    if (!image || !image.url) {
      return res.status(400).json({ error: 'No image URL provided' });
    }


    const newProject = new Project({
      projectName,
      teamMembers,
      adviser,
      description,
      image,
    });

    // Save the project to the database
    const savedProject = await newProject.save();
    
    return res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error in createProject:", error.message);
    return res.status(500).json({ error: error.message || 'An error occurred while creating the project' });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

const updateProject = async (req, res) => {
  const { projectName, teamMembers, adviser, description, image } = req.body;
  const { id } = req.params;

  try {
      let updatedFields = {
          projectName,
          teamMembers,
          adviser,
          description,
      };

      if (image && image.url) {
          // Update the image URL directly from the request
          updatedFields.image = {
              url: image.url,
              publicId: image.publicId || null, // Handle publicId if needed
          };
      }

      const updatedProject = await Project.findByIdAndUpdate(
          id,
          updatedFields,
          { new: true }
      );

      if (!updatedProject) {
          return res.status(404).json({ error: 'Project not found' });
      }

      res.status(200).json(updatedProject);
  } catch (error) {
      console.error("Error updating project:", error.message);
      res.status(500).json({ error: 'An error occurred while updating the project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
};

export { createProject, updateProject };
