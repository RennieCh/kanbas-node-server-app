import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Course", 
      required: true 
    }, // Reference to a course
    title: { type: String, default: "Unnamed Quiz" },
    type: { type: String, default: "Graded Quiz" }, 
    points: { type: Number, default: 0 },
    assignmentGroup: { type: String, default: "QUIZZES"},
    cloneable: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    description: { type: String, default: "" },
    shuffleAnswer: { type: Boolean, default: false },
    timeLimit: { type: String, default: "20" }, // Time limit in minutes
    allowMultiAttempts: { type: Boolean, default: false },
    numberOfAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "Immediately" },
    oneQuestionAtATime: { type: Boolean, default: true },
    accessCode: { type: String, default:"" },
    webCam: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    availableFromDate: { type: String },
    dueDate: { type: String },
    availableUntilDate: { type: String },
  },
  { collection: "quizzes"}
);

export default quizSchema;
