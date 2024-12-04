import model from "./model.js";

// Create a new assignment
export async function createAssignment(assignment) {
    try {
        delete assignment._id; // Ensure no invalid `_id` is passed
        const newAssignment = await model.create(assignment);
        return newAssignment;
    } catch (error) {
        console.error("Error creating assignment:", error);
        throw error;
    }
}

// Find assignments for a specific course
export async function findAssignmentsForCourse(courseId) {
    try {
        const assignments = await model.find({ course: courseId }).populate("course");
        return assignments;
    } catch (error) {
        console.error("Error finding assignments for course:", error);
        throw error;
    }
}

// Update an assignment
export async function updateAssignment(assignmentId, assignmentUpdates) {
    try {
        const updatedAssignment = await model.findByIdAndUpdate(
            assignmentId,
            assignmentUpdates,
            { new: true }
        );
        return updatedAssignment;
    } catch (error) {
        console.error("Error updating assignment:", error);
        throw error;
    }
}

// Delete an assignment
export async function deleteAssignment(assignmentId) {
    try {
        await model.findByIdAndDelete(assignmentId);
    } catch (error) {
        console.error("Error deleting assignment:", error);
        throw error;
    }
}