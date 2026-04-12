import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao() {
  const findAllCourses = () => model.find();
  
  const findCourseById = (courseId) => model.findById(courseId);
  
  const createCourse = (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  };
  
  const deleteCourse = (courseId) => model.deleteOne({ _id: courseId });
  
  const updateCourse = (courseId, courseUpdates) => 
    model.updateOne({ _id: courseId }, { $set: courseUpdates });

  return { findAllCourses, findCourseById, createCourse, deleteCourse, updateCourse };
}
