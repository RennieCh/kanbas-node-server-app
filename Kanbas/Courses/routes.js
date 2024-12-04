import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js"
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {

    app.get("/api/courses", async (req, res) => {
        try {
            const courses = await dao.findAllCourses();
            res.status(200).send(courses);
        } catch (error) {
            console.error("Error fetching courses:", error); // Error log
            res.status(500).send({ error: "Failed to fetch courses" });
        }
    });


    app.delete("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;

        try {
            // Verify if course exists
            const course = await dao.findCourseById(courseId);
            if (!course) {
                return res.status(404).json({ error: `Course with ID ${courseId} not found.` });
            }

            // Delete the course and its related enrollments
            const result = await dao.deleteCourse(courseId);

            console.log(`Deleted course with ID: ${courseId}`, result);
            res.status(200).json({ message: "Course deleted successfully.", result });
        } catch (error) {
            console.error("Error deleting course:", error.message);
            res.status(500).json({ error: "Failed to delete course. Check server logs for details." });
        }
    });


    app.put("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = await dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    });

    app.post("/api/courses", async (req, res) => {
        try {
            const { name, description, number, startDate, endDate } = req.body;

            if (!name || !description || !number || !startDate || !endDate) {
                return res.status(400).json({ error: "Missing required course fields." });
            }

            const course = await dao.createCourse(req.body);
            const currentUser = req.session["currentUser"];

            if (currentUser) {
                await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
            }

            res.status(201).json(course);
        } catch (error) {
            console.error("Error creating course:", error);
            res.status(500).json({ error: "Failed to create course." });
        }
    });


    app.post("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = await modulesDao.createModule(module);
        res.send(newModule);
    });

    app.get("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });

    app.post("/api/courses/:courseId/assignments", async (req, res) => {
        const newAssignment = await assignmentsDao.createAssignment({ ...req.body, course: req.params.courseId });
        res.status(201).json(newAssignment);
    });

    app.get("/api/courses/:courseId/assignments", async (req, res) => {
        const assignments = await assignmentsDao.findAssignmentsForCourse(req.params.courseId);
        res.json(assignments);
    });

    app.get("/api/courses/:cid/users", async (req, res) => {
        const { cid } = req.params;
        const users = await enrollmentsDao.findUsersForCourse(cid);
        res.json(users);
    });
}