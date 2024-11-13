import Database from "../Database/index.js";

// Function to fetch all enrollments
export function findAllEnrollments() {
    const { enrollments } = Database;
    return enrollments;
}

// Function to enroll a user in a course
export function enrollUserInCourse(userId, courseId) {
    const { enrollments } = Database;
    enrollments.push({ _id: Date.now(), user: userId, course: courseId });
}

// Function to unenroll a user from a course
export function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = Database;
    Database.enrollments = enrollments.filter(
        (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
    );
}

// Function to find enrollments for a specific user
export function findEnrollmentsForUser(userId) {
    const { enrollments } = Database;
    return enrollments.filter((enrollment) => enrollment.user === userId);
}
