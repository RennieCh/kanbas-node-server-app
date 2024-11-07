import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {

    app.put("/api/assignments/:assignmentId", (req, res) => {
        const updatedAssignment = assignmentsDao.updateAssignment(req.params.assignmentId, req.body);
        res.json(updatedAssignment);
    });

    app.delete("/api/assignments/:assignmentId", (req, res) => {
        assignmentsDao.deleteAssignment(req.params.assignmentId);
        res.sendStatus(204);
    });
}
