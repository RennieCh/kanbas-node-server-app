import QuizModel from "./model.js";
import QuestionModel from "../Questions/model.js";
import AnswerModel from "../Answers/model.js";
import mongoose from "mongoose";

export function findAllQuizzes() {
  try {
    const quizzes = QuizModel.find();
    return quizzes;
  } catch (error) {
    console.error("Error in findAllQuizzes:", error); // Error log
    throw error;
  }
};

// Create a new quiz
export const createQuiz = async (quizData) => {
  try {
    delete quizData._id;
    const quiz = new QuizModel(quizData);
    return await quiz.save();
  } catch (error) {
    throw new Error(`Error creating quiz: ${error.message}`);
  }
};

// Get all quizzes for a specific course
export const getQuizzesByCourse = async (courseId) => {
  try {
    return await QuizModel.find({ course: courseId });
  } catch (error) {
    throw new Error(`Error fetching quizzes: ${error.message}`);
  }
};

// Get a single quiz by ID
export const getQuizById = async (quizId) => {
  try {
    return await QuizModel.findById(quizId);
  } catch (error) {
    throw new Error(`Error fetching quiz: ${error.message}`);
  }
};

// Update a quiz by ID
export const updateQuiz = async (quizId, updatedData) => {
  try {
    return await QuizModel.findByIdAndUpdate(quizId, updatedData, { new: true });
  } catch (error) {
    throw new Error(`Error updating quiz: ${error.message}`);
  }
};

// Delete a quiz by ID
export const deleteQuiz = async (quizId) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      throw new Error(`Invalid ObjectId: ${quizId}`);
    }

    const objectId = new mongoose.Types.ObjectId(quizId);

    // Delete related questions
    const questionDeleteResult = await QuestionModel.deleteMany({ quiz: objectId });
    console.log(`Deleted ${questionDeleteResult.deletedCount} questions for quiz ${quizId}`);

    // Delete related answers
    const answerDeleteResult = await AnswerModel.deleteMany({ quizID: objectId });
    console.log(`Deleted ${answerDeleteResult.deletedCount} answers for quiz ${quizId}`);

    // Delete the quiz
    const quizDeleteResult = await QuizModel.deleteOne({ _id: objectId });
    if (quizDeleteResult.deletedCount === 0) {
      throw new Error(`Quiz with ID ${quizId} not found.`);
    }

    console.log(`Deleted quiz with ID: ${quizId}`);
    return { questionDeleteResult, answerDeleteResult, quizDeleteResult };
  } catch (error) {
    throw new Error(`Error deleting quiz: ${error.message}`);
  }
};

// Get total quiz points by summing all related questions' points
export const calculateQuizPoints = async (quizId) => {
  try {
    const questions = await QuestionModel.find({ quiz: quizId });
    return questions.reduce((total, question) => total + question.points, 0);
  } catch (error) {
    throw new Error(`Error calculating quiz points: ${error.message}`);
  }
};

// Update quiz points
export const updateQuizPoints = async (quizId) => {
  try {
    const totalPoints = await calculateQuizPoints(quizId);
    return await QuizModel.findByIdAndUpdate(quizId, { points: totalPoints }, { new: true });
  } catch (error) {
    throw new Error(`Error updating quiz points: ${error.message}`);
  }
};

