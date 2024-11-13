import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
    // Route to fetch all enrollments
    app.get("/api/enrollments", (req, res) => {
        const enrollments = enrollmentsDao.findAllEnrollments();
        res.json(enrollments);
    });

    // Enroll a user in a course
    app.post("/api/users/:userId/courses/:courseId/enroll", (req, res) => {
        const { userId, courseId } = req.params;
        const newEnrollment = enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.status(201).json(newEnrollment);
    });

    // Unenroll a user from a course
    app.delete("/api/users/:userId/courses/:courseId/unenroll", (req, res) => {
        const { userId, courseId } = req.params;
        enrollmentsDao.unenrollUserFromCourse(userId, courseId);
        res.sendStatus(204);
    });
}
