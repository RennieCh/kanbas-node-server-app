import * as enrollmentsDao from "./dao.js";
import mongoose from "mongoose";

export default function EnrollmentRoutes(app) {
    // Route to fetch all enrollments
    app.get("/api/enrollments", async (req, res) => {
        const enrollments = await enrollmentsDao.findAllEnrollments();
        res.json(enrollments);
    });

    // Enroll a user in a course
    app.post("/api/users/:userId/courses/:courseId/enroll", async (req, res) => {
        const { userId, courseId } = req.params;
        const newEnrollment = await enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.status(201).json(newEnrollment);
    });

    // Unenroll a user from a course
    app.delete("/api/users/:userId/courses/:courseId/unenroll", async (req, res) => {
        const { userId, courseId } = req.params;
        await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
        res.sendStatus(204);
    });
}
