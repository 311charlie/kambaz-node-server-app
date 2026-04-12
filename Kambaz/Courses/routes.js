import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) { res.sendStatus(401); return; }
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = await dao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.json(status);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.updateCourse(courseId, req.body);
    res.json(status);
  };

  const enrollUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      userId = req.session["currentUser"]._id;
    }
    const { courseId } = req.body;
    const status = await enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.json(status);
  };

  const unenrollUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      userId = req.session["currentUser"]._id;
    }
    const { courseId } = req.body;
    const status = await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    res.json(status);
  };

  const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(courseId);
    res.json(users);
  };

  app.get("/api/courses", findAllCourses);
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.post("/api/users/:userId/courses/enroll", enrollUser);
  app.delete("/api/users/:userId/courses/unenroll", unenrollUser);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
}
