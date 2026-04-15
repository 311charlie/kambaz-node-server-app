import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: String,
  answer: mongoose.Schema.Types.Mixed,
});

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    user: { type: String, ref: "UserModel" },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    attemptNumber: { type: Number, default: 1 },
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;
