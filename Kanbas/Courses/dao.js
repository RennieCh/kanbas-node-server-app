//import Database from "../Database/index.js";
import model from "./model.js";
import mongoose from "mongoose";

export function findAllCourses() {
    try {
        const courses = model.find();
        return courses;
    } catch (error) {
        console.error("Error in findAllCourses:", error); // Error log
        throw error;
    }
}

// Retrieve courses for an enrolled user
export async function findCoursesForEnrolledUser(userId) {
    const enrollments = await mongoose.connection.collection("enrollments").find({ userId }).toArray();
    const courseIds = enrollments.map((enrollment) => enrollment.courseId);
    return model.find({ _id: { $in: courseIds } });
}

export async function createCourse(course) {
    try {
        delete course._id; // Ensure no invalid `_id` is passed
        const newCourse = await model.create(course);
        console.log("Created course:", newCourse);
        return newCourse;
    } catch (error) {
        console.error("Error in createCourse DAO:", error);
        throw error;
    }
}

export async function findCourseById(courseId) {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new Error(`Invalid ObjectId: ${courseId}`);
        }

        return await model.findById(new mongoose.Types.ObjectId(courseId));
    } catch (error) {
        console.error("Error in findCourseById DAO:", error.message);
        throw error;
    }
}

export async function deleteCourse(courseId) {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new Error(`Invalid ObjectId: ${courseId}`);
        }

        const objectId = new mongoose.Types.ObjectId(courseId);

        // Delete related enrollments
        const enrollmentDeleteResult = await mongoose.connection
            .collection("enrollments")
            .deleteMany({ course: objectId });

        console.log(`Deleted ${enrollmentDeleteResult.deletedCount} enrollments for course ${courseId}`);

        // Delete the course
        const courseDeleteResult = await model.deleteOne({ _id: objectId });

        if (courseDeleteResult.deletedCount === 0) {
            throw new Error(`Course with ID ${courseId} not found.`);
        }

        console.log(`Deleted course with ID: ${courseId}`);
        return { enrollmentDeleteResult, courseDeleteResult };
    } catch (error) {
        console.error("Error in deleteCourse DAO:", error.message);
        throw error;
    }
}

export function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, courseUpdates);
}