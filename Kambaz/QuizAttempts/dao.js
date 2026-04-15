import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizAttemptsDao() {
  const findAttemptsForQuizByUser = (quizId, userId) =>
    model.find({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });

  const findLatestAttempt = (quizId, userId) =>
    model.findOne({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });

  const countAttempts = (quizId, userId) =>
    model.countDocuments({ quiz: quizId, user: userId });

  const createAttempt = async (attempt) => {
    const count = await countAttempts(attempt.quiz, attempt.user);
    const newAttempt = {
      ...attempt,
      _id: uuidv4(),
      attemptNumber: count + 1,
      submittedAt: new Date(),
    };
    return model.create(newAttempt);
  };

  return {
    findAttemptsForQuizByUser,
    findLatestAttempt,
    countAttempts,
    createAttempt,
  };
}
