import * as questionsDao from "./dao.js";

export default function QuestionsRoutes(app) {
  // Get all the questions
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await questionsDao.findAllQuestions();
      res.status(200).send(questions);
    } catch (error) {
      console.error("Error fetching all questions:", error); // Error log
      res.status(500).send({ error: "Failed to fetch all questions" });
    }
  });

  // Create a new question
  app.post("/api/questions", async (req, res) => {
    try {
      const questionData = req.body;
      const newQuestion = await questionsDao.createQuestion(questionData);
      res.status(201).json(newQuestion);
    } catch (error) {
      console.error("Error creating question:", error.message);
      res.status(500).json({ error: "Failed to create question." });
    }
  });

  // Get all questions for a specific quiz
  app.get("/api/quizzes/:quizId/questions", async (req, res) => {
    try {
      const { quizId } = req.params;
      const questions = await questionsDao.getQuestionsByQuiz(quizId);
      res.status(200).json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error.message);
      res.status(500).json({ error: "Failed to fetch questions." });
    }
  });

  // Get a single question by ID
  app.get("/api/questions/:questionId", async (req, res) => {
    try {
      const { questionId } = req.params;
      const question = await questionsDao.getQuestionById(questionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(200).json(question);
    } catch (error) {
      console.error("Error fetching question:", error.message);
      res.status(500).json({ error: "Failed to fetch question." });
    }
  });

  // Update a question by ID
  app.put("/api/questions/:questionId", async (req, res) => {
    try {
      const { questionId } = req.params;
      const updatedData = req.body;
      const updatedQuestion = await questionsDao.updateQuestion(questionId, updatedData);
      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(200).json(updatedQuestion);
    } catch (error) {
      console.error("Error updating question:", error.message);
      res.status(500).json({ error: "Failed to update question." });
    }
  });

  // Delete a question by ID
  app.delete("/api/questions/:questionId", async (req, res) => {
    const { questionId } = req.params;
    try {
      const deleteResult = await questionsDao.deleteQuestion(questionId);
      res.status(200).json({ message: "Question deleted successfully.", result: deleteResult });
    } catch (error) {
      console.error("Error deleting question:", error.message);
      res.status(500).json({ error: "Failed to delete question. Check server logs for details." });
    }
  });
}
