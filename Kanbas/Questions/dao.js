import QuestionModel from "./model.js";
import mongoose from "mongoose";

// Get all the Questions
export function findAllQuestions() {
  try {
    const questions = QuestionModel.find();
    return questions;
  } catch (error) {
    console.error("Error in findAllQuestions:", error); // Error log
    throw error;
  }
};

// Create a new question
export const createQuestion = async (questionData) => {
  try {
    delete questionData._id;
    const question = new QuestionModel(questionData);
    return await question.save();
  } catch (error) {
    throw new Error(`Error creating question: ${error.message}`);
  }
};

// Get all questions for a specific quiz
export const getQuestionsByQuiz = async (quizId) => {
  try {
    return await QuestionModel.find({ quiz: quizId });
  } catch (error) {
    throw new Error(`Error fetching questions: ${error.message}`);
  }
};

// Get a single question by ID
export const getQuestionById = async (questionId) => {
  try {
    return await QuestionModel.findById(questionId);
  } catch (error) {
    throw new Error(`Error fetching question: ${error.message}`);
  }
};

// Update a question by ID
export const updateQuestion = async (questionId, updatedData) => {
  try {
    return await QuestionModel.findByIdAndUpdate(questionId, updatedData, { new: true });
  } catch (error) {
    throw new Error(`Error updating question: ${error.message}`);
  }
};

// Delete a question by ID
export const deleteQuestion = async (questionId) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      throw new Error(`Invalid ObjectId: ${questionId}`);
    }

    const objectId = new mongoose.Types.ObjectId(questionId);
    const questionDeleteResult = await QuestionModel.deleteOne({ _id: objectId });
    if (questionDeleteResult.deletedCount === 0) {
      throw new Error(`Question with ID ${questionId} not found.`);
    }

    console.log(`Deleted question with ID: ${questionId}`);
    return questionDeleteResult;
  } catch (error) {
    throw new Error(`Error deleting question: ${error.message}`);
  }
};
