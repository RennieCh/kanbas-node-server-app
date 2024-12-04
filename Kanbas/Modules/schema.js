import mongoose from "mongoose";

// Define the Lesson schema
const lessonSchema = new mongoose.Schema({
    _id: String, // Lesson ID
    name: String, // Lesson name
    description: String, // Lesson description
    module: { type: mongoose.Schema.Types.ObjectId, ref: "ModuleModel" }, // Reference to the module
  });


// Define the Module schema
const schema = new mongoose.Schema(
    {
      name: String, // Module name
      description: String, // Module description
      course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" }, // Reference to the course
      lessons: [lessonSchema], // Array of lessons using the Lesson schema
    },
    { collection: "modules" }
  );

export default schema;