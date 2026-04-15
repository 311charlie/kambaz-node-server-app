import QuizAttemptsDao from "./dao.js";
import QuizzesDao from "../Quizzes/dao.js";

export default function QuizAttemptRoutes(app) {
  const attemptsDao = QuizAttemptsDao();
  const quizzesDao = QuizzesDao();

  const getMyAttempts = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const attempts = await attemptsDao.findAttemptsForQuizByUser(quizId, currentUser._id);
    res.json(attempts);
  };

  const getLatestAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const attempt = await attemptsDao.findLatestAttempt(quizId, currentUser._id);
    res.json(attempt);
  };

  const submitAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const attemptCount = await attemptsDao.countAttempts(quizId, currentUser._id);
    if (!quiz.multipleAttempts && attemptCount >= 1) {
      return res.status(400).json({ message: "No more attempts allowed" });
    }
    if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
      return res.status(400).json({ message: "No more attempts allowed" });
    }

    const { answers } = req.body;
    let score = 0;

    quiz.questions.forEach((question) => {
      const userAnswer = answers.find((a) => a.questionId === question._id);
      if (!userAnswer) return;

      if (question.type === "MULTIPLE_CHOICE") {
        const correctChoice = question.choices.find((c) => c.isCorrect);
        if (userAnswer.answer === correctChoice?._id) {
          score += question.points || 0;
        }
      } else if (question.type === "TRUE_FALSE") {
        if (userAnswer.answer === question.correctAnswer) {
          score += question.points || 0;
        }
      } else if (question.type === "FILL_IN_BLANK") {
        const correctAnswers = question.blanks.map((b) => b.toLowerCase().trim());
        if (correctAnswers.includes(userAnswer.answer?.toLowerCase().trim())) {
          score += question.points || 0;
        }
      }
    });

    const attempt = await attemptsDao.createAttempt({
      quiz: quizId,
      user: currentUser._id,
      answers,
      score,
    });

    res.json(attempt);
  };

  app.get("/api/quizzes/:quizId/attempts", getMyAttempts);
  app.get("/api/quizzes/:quizId/attempts/latest", getLatestAttempt);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
}
