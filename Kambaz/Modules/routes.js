import ModulesDao from "./dao.js";

export default function ModuleRoutes(app) {
  const dao = ModulesDao();

  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const modules = await dao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModule = async (req, res) => {
    const { courseId } = req.params;
    const module = await dao.createModule(courseId, req.body);
    res.json(module);
  };

  const deleteModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const status = await dao.deleteModule(courseId, moduleId);
    res.json(status);
  };

  const updateModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const module = await dao.updateModule(courseId, moduleId, req.body);
    res.json(module);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModule);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
}
