import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {

    // Create a new assignment
    app.post("/api/assignments", async (req, res) => {
        try {
            const newAssignment = await assignmentsDao.createAssignment(req.body);
            res.status(201).json(newAssignment);
        } catch (error) {
            console.error("Error creating assignment:", error);
            res.status(500).send("Failed to create assignment");
        }
    });

    // Find assignments for a specific course
    app.get("/api/courses/:courseId/assignments", async (req, res) => {
        try {
            const assignments = await assignmentsDao.findAssignmentsForCourse(req.params.courseId);
            res.json(assignments);
        } catch (error) {
            console.error("Error fetching assignments for course:", error);
            res.status(500).send("Failed to fetch assignments");
        }
    });

     // Update an assignment
     app.put("/api/assignments/:assignmentId", async (req, res) => {
        try {
            const updatedAssignment = await assignmentsDao.updateAssignment(req.params.assignmentId, req.body);
            res.json(updatedAssignment);
        } catch (error) {
            console.error("Error updating assignment:", error);
            res.status(500).send("Failed to update assignment");
        }
    });

    // Delete an assignment
    app.delete("/api/assignments/:assignmentId", async (req, res) => {
        try {
            await assignmentsDao.deleteAssignment(req.params.assignmentId);
            res.sendStatus(204);
        } catch (error) {
            console.error("Error deleting assignment:", error);
            res.status(500).send("Failed to delete assignment");
        }
    });
}
