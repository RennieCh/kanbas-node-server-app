import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "CourseModel", // Reference to the Course model
      },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "UserModel", // Reference to the User model
    },
    grade: Number,
    letterGrade: String,
    enrollmentDate: Date,
    status: { 
      type: String, 
      enum: ["ENROLLED", "DROPPED", "COMPLETED"], // Example status options
      default: "ENROLLED" 
    }
  },
  { collection: "enrollments" }
);

// Add a unique index to prevent duplicate enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default enrollmentSchema;
