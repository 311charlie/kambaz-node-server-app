import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao() {
  const findQuizzesForCourse = (courseId) =>
    model.find({ course: courseId }).sort({ availableFrom: 1 });

  const findQuizById = (quizId) => model.findById(quizId);

  const createQuiz = (quiz) => {
    const newQuiz = { ...quiz, _id: uuidv4() };
    return model.create(newQuiz);
  };

  const updateQuiz = (quizId, quizUpdates) =>
    model.updateOne({ _id: quizId }, { $set: quizUpdates });

  const deleteQuiz = (quizId) => model.deleteOne({ _id: quizId });

  const addQuestion = async (quizId, question) => {
    const newQuestion = { ...question, _id: uuidv4() };
    await model.updateOne({ _id: quizId }, { $push: { questions: newQuestion } });
    return newQuestion;
  };

  const updateQuestion = async (quizId, questionId, questionUpdates) => {
    const quiz = await model.findById(quizId);
    const question = quiz.questions.id(questionId);
    Object.assign(question, questionUpdates);
    await quiz.save();
    return question;
  };

  const deleteQuestion = (quizId, questionId) =>
    model.updateOne({ _id: quizId }, { $pull: { questions: { _id: questionId } } });

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
