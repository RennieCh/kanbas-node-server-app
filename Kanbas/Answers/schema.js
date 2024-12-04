import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
      quizID: { type: mongoose.Schema.Types.ObjectId, ref: "QuizModel", required: true },
      courseID: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel", required: true },
      score: { type: Number, default: 0 },
      answers: { type: [String], default: [] },
      attemptTaken: { type: Number, default: 1 },
      startTime: { type: String},
      endTime: { type: String}
    },
    { collection: "answers", timestamps: true } // Add timestamps for createdAt and updatedAt
  );
  
  export default answerSchema;
  