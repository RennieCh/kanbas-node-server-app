//import Database from "../Database/index.js";
import model from "./model.js";

// Function to fetch all enrollments
export function findAllEnrollments() {
    return model.find().populate("course").populate("user"); // Populate course and user references
}

// Function to enroll a user in a course
export async function enrollUserInCourse(user, course) {
    try {
        // Check if the enrollment already exists
        const existingEnrollment = await model.findOne({ user, course });
        if (existingEnrollment) {
            console.log("User is already enrolled in the course.");
            return existingEnrollment; // Return the existing enrollment
        }

        // Create a new enrollment
        return model.create({ user, course, enrollmentDate: new Date() });
    } catch (error) {
        console.error("Error enrolling user in course:", error);
        throw error;
    }
}

// Function to unenroll a user from a course
export function unenrollUserFromCourse(user, course) {
    return model.deleteOne({ user, course });
}

// Function to find enrollments for a specific user
export function findEnrollmentsForUser(userId) {
    return model.find({ user: userId }).populate("course"); // Populate course details
}

export async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
}

export async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
}