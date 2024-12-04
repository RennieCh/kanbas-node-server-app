import * as quizzesDao from "./dao.js";
import * as questionsDao from "../Questions/dao.js";
import * as answersDao from "../Answers/dao.js";

export default function QuizzesRoutes(app) {

  app.get("/api/quizzes", async (req, res) => {
    try {
      const quizzes = await quizzesDao.findAllQuizzes();
      res.status(200).send(quizzes);
    } catch (error) {
      console.error("Error fetching all quizzes:", error); // Error log
      res.status(500).send({ error: "Failed to fetch all quizzes" });
    }
  });

  // Create a new quiz
  app.post("/api/quizzes", async (req, res) => {
    try {
      const quizData = req.body;
      const newQuiz = await quizzesDao.createQuiz(quizData);
      res.status(201).json(newQuiz);
    } catch (error) {
      console.error("Error creating quiz:", error.message);
      res.status(500).json({ error: "Failed to create quiz." });
    }
  });

  // Get all quizzes for a specific course
  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const { courseId } = req.params;
      const quizzes = await quizzesDao.getQuizzesByCourse(courseId);
      res.status(200).json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error.message);
      res.status(500).json({ error: "Failed to fetch quizzes." });
    }
  });

  // Get a single quiz by ID
  app.get("/api/quizzes/:quizId", async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await quizzesDao.getQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      res.status(200).json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error.message);
      res.status(500).json({ error: "Failed to fetch quiz." });
    }
  });

  // Update a quiz by ID
  app.put("/api/quizzes/:quizId", async (req, res) => {
    try {
      const { quizId } = req.params;
      const updatedData = req.body;
      const updatedQuiz = await quizzesDao.updateQuiz(quizId, updatedData);
      if (!updatedQuiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      res.status(200).json(updatedQuiz);
    } catch (error) {
      console.error("Error updating quiz:", error.message);
      res.status(500).json({ error: "Failed to update quiz." });
    }
  });

  // Delete a quiz by ID
  app.delete("/api/quizzes/:quizId", async (req, res) => {
    const { quizId } = req.params;
    try {
      // Verify if quiz exists
      const quiz = await quizzesDao.getQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: `Quiz with ID ${quizId} not found.` });
      }

      // Delete the quiz and its related questions and answers
      const deleteResult = await quizzesDao.deleteQuiz(quizId);

      console.log(`Deleted quiz with ID: ${quizId}`, deleteResult);
      res.status(200).json({ message: "Quiz deleted successfully.", result: deleteResult });
    } catch (error) {
      console.error("Error deleting quiz:", error.message);
      res.status(500).json({ error: "Failed to delete quiz. Check server logs for details." });
    }
  });

  app.put("/api/quizzes/:quizId/points", async (req, res) => {
    try {
      const { quizId } = req.params;
      const updatedQuiz = await quizzesDao.updateQuizPoints(quizId);
      if (!updatedQuiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      res.status(200).json(updatedQuiz);
    } catch (error) {
      console.error("Error updating quiz points:", error.message);
      res.status(500).json({ error: "Failed to update quiz points." });
    }
  });
  
}
