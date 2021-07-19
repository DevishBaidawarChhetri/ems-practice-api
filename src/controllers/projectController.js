const ProjectProvider = require("../models/projectSchema");

/* Add Project */
exports.addProject = async (req, res) => {
  try {
    const { projectName } = req.body;
    if (!projectName) {
      return res.status(422).json({ message: "Do not leave fields empty." });
    }
    const projectExists = await ProjectProvider.findOne({ projectName });
    if (projectExists) {
      return res.status(422).json({ message: "Project already exist." });
    } else {
      const name = new ProjectProvider({ projectName });
      const success = await name.save();
      if (success) {
        return res.status(201).json({ message: "Inserted Successfully" });
      } else {
        return res.status(400).json({ message: "Something went wrong" });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server Error!",
    });
  }
};

/* Get All Projects (also with pagination) */
exports.getProjects = async (req, res) => {
  try {
    const currentPage = +req.query.currentPage;
    const pageSize = +req.query.pageSize;

    if (currentPage && pageSize) {
      const fetchedProjects = await ProjectProvider.find({})
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
      const count = await ProjectProvider.countDocuments();
      return res.status(200).json({
        projects: fetchedProjects,
        totalProjects: count,
        message: "Fetched Successfully",
      });
    } else {
      const projects = await ProjectProvider.find({});
      if (projects) {
        return res.status(200).json({
          message: "Fetched Successfully",
          projects,
        });
      } else {
        return res.status(400).json({ message: "Something went wrong." });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server Error!",
    });
  }
};

/* Delete Project  */
exports.deleteProject = async (req, res) => {
  try {
    const deleteProject = await ProjectProvider.findOneAndDelete({
      _id: req.params.id,
    });
    if (deleteProject) {
      return res.status(200).json({ message: "Project Deleted!" });
    } else {
      return res.status(400).json({ message: "Something went wrong." });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server Error!",
    });
  }
};

/* Update Project (PUT) */
exports.updateProject = async (req, res) => {
  try {
    const updateProject = await ProjectProvider.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );
    if (updateProject) {
      return res.status(200).json({ message: "Project Updated!" });
    } else {
      return res.status(400).json({ message: "Something went wrong." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error!" });
  }
};
