import AnswerModel from "./model.js";
import mongoose from "mongoose";

// Get all the answers
export function findAllAnswers() {
    try {
        const answers = AnswerModel.find();
        return answers;
    } catch (error) {
        console.error("Error in findAllAnswers:", error); // Error log
        throw error;
    }
};

// Create a new answer
export const createAnswer = async (answerData) => {
    try {
        delete answerData._id;
        const answer = new AnswerModel(answerData);
        return await answer.save();
    } catch (error) {
        throw new Error(`Error creating answer: ${error.message}`);
    }
};

// Get all answers for a specific quiz
export const getAnswersByQuiz = async (quizId) => {
    try {
        return await AnswerModel.find({ quizID: quizId });
    } catch (error) {
        throw new Error(`Error fetching answers: ${error.message}`);
    }
};

// Get all answers for a specific user
export const getAnswersByUser = async (userId) => {
    try {
        return await AnswerModel.find({ userID: userId });
    } catch (error) {
        throw new Error(`Error fetching answers: ${error.message}`);
    }
};

// Get a single answer by ID
export const getAnswerById = async (answerId) => {
    try {
        return await AnswerModel.findById(answerId);
    } catch (error) {
        throw new Error(`Error fetching answer: ${error.message}`);
    }
};

// Update an answer by ID
export const updateAnswer = async (answerId, updatedData) => {
    try {
        return await AnswerModel.findByIdAndUpdate(answerId, updatedData, { new: true });
    } catch (error) {
        throw new Error(`Error updating answer: ${error.message}`);
    }
};

// Delete an answer by ID
export const deleteAnswer = async (answerId) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(answerId)) {
            throw new Error(`Invalid ObjectId: ${answerId}`);
        }

        const objectId = new mongoose.Types.ObjectId(answerId);
        const answerDeleteResult = await AnswerModel.deleteOne({ _id: objectId });
        if (answerDeleteResult.deletedCount === 0) {
            throw new Error(`Answer with ID ${answerId} not found.`);
        }

        console.log(`Deleted answer with ID: ${answerId}`);
        return answerDeleteResult;
    } catch (error) {
        throw new Error(`Error deleting answer: ${error.message}`);
    }
};

// Add or update an answer
export const addOrUpdateAnswer = async (userID, quizID, courseID, answerData) => {
    try {
        // Check if an answer already exists for the given user, quiz, and course
        let existingAnswer = await AnswerModel.findOne({ userID, quizID, courseID });

        if (existingAnswer) {
            // Update existing answer
            existingAnswer.attemptTaken += 1;
            existingAnswer.startTime = answerData.startTime;
            existingAnswer.endTime = answerData.endTime;
            existingAnswer.score = answerData.score;
            existingAnswer.answers = answerData.answers;

            return await existingAnswer.save();
        } else {
            // Create a new answer
            const newAnswer = new AnswerModel({
                userID,
                quizID,
                courseID,
                score: answerData.score || 0,
                answers: answerData.answers || [],
                attemptTaken: 1,
                startTime: answerData.startTime || new Date().toISOString(),
                endTime: answerData.endTime || null,
            });

            return await newAnswer.save();
        }
    } catch (error) {
        throw new Error(`Error adding or updating answer: ${error.message}`);
    }
};