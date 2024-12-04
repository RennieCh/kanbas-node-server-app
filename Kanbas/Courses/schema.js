import mongoose from "mongoose";
const courseSchema = new mongoose.Schema(
 {
   name: String,
   number: String,
   startDate: String,
   endDate: String,
   department: String,
   credits: Number,
   description: String
},
 { collection: "courses" }
);
export default courseSchema;