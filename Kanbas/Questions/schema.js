import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
      quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizModel",
        required: true
      },
      title: { type: String, default: "New Question" },
      type: { type: String, default: "Multiple choice" },
      points: { type: Number, default: 0 },
      question: { type: String, default: "" },
      correctAnswer: { type: String, default: "" },
      choices: { type: [String], default: [""] }
    },
    { collection: "questions"}
  );
  
  export default questionSchema;
  