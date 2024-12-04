import * as answersDao from "./dao.js";

export default function AnswersRoutes(app) {
  // Create a new answer
  app.post("/api/answers", async (req, res) => {
    try {
      const answerData = req.body;
      const newAnswer = await answersDao.createAnswer(answerData);
      res.status(201).json(newAnswer);
    } catch (error) {
      console.error("Error creating answer:", error.message);
      res.status(500).json({ error: "Failed to create answer." });
    }
  });

  // Get all answers for a specific quiz
  app.get("/api/quizzes/:quizId/answers", async (req, res) => {
    try {
      const { quizId } = req.params;
      const answers = await answersDao.getAnswersByQuiz(quizId);
      res.status(200).json(answers);
    } catch (error) {
      console.error("Error fetching answers:", error.message);
      res.status(500).json({ error: "Failed to fetch answers." });
    }
  });

  // Get all answers for a specific user
  app.get("/api/users/:userId/answers", async (req, res) => {
    try {
      const { userId } = req.params;
      const answers = await answersDao.getAnswersByUser(userId);
      res.status(200).json(answers);
    } catch (error) {
      console.error("Error fetching answers:", error.message);
      res.status(500).json({ error: "Failed to fetch answers." });
    }
  });

  // Get a single answer by ID
  app.get("/api/answers/:answerId", async (req, res) => {
    try {
      const { answerId } = req.params;
      const answer = await answersDao.getAnswerById(answerId);
      if (!answer) {
        return res.status(404).json({ error: "Answer not found" });
      }
      res.status(200).json(answer);
    } catch (error) {
      console.error("Error fetching answer:", error.message);
      res.status(500).json({ error: "Failed to fetch answer." });
    }
  });

  // Update an answer by ID
  app.put("/api/answers/:answerId", async (req, res) => {
    try {
      const { answerId } = req.params;
      const updatedData = req.body;
      const updatedAnswer = await answersDao.updateAnswer(answerId, updatedData);
      if (!updatedAnswer) {
        return res.status(404).json({ error: "Answer not found" });
      }
      res.status(200).json(updatedAnswer);
    } catch (error) {
      console.error("Error updating answer:", error.message);
      res.status(500).json({ error: "Failed to update answer." });
    }
  });

  // Delete an answer by ID
  app.delete("/api/answers/:answerId", async (req, res) => {
    const { answerId } = req.params;
    try {
      const deleteResult = await answersDao.deleteAnswer(answerId);
      res.status(200).json({ message: "Answer deleted successfully.", result: deleteResult });
    } catch (error) {
      console.error("Error deleting answer:", error.message);
      res.status(500).json({ error: "Failed to delete answer. Check server logs for details." });
    }
  });

  // Add or update an answer
  app.post("/api/answers/addOrUpdate", async (req, res) => {
    try {
      const { userID, quizID, courseID, score, answers, startTime, endTime } = req.body;
      const updatedAnswer = await answersDao.addOrUpdateAnswer(userID, quizID, courseID, {
        score,
        answers,
        startTime,
        endTime,
      });
      res.status(200).json(updatedAnswer);
    } catch (error) {
      console.error("Error adding or updating answer:", error.message);
      res.status(500).json({ error: "Failed to add or update answer." });
    }
  });
}
