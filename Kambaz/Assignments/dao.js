import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao() {
  const findAssignmentsForCourse = (courseId) => model.find({ course: courseId });

  const findAssignmentById = (assignmentId) => model.findById(assignmentId);

  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  };

  const updateAssignment = (assignmentId, assignmentUpdates) =>
    model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });

  const deleteAssignment = (assignmentId) => model.deleteOne({ _id: assignmentId });

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
