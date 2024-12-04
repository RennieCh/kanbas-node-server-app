import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };

    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };

    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return
        }
        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users)
            return;
        }
        const users = await dao.findAllUsers();
        return res.json(users);
    };

    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };

    const updateUser = async (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser._id === userId) {
            req.session["currentUser"] = { ...currentUser, ...userUpdates };
        }
        res.json(currentUser);
    };

    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };

    const signout = async (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    const findCoursesForEnrolledUser = async (req, res) => {
        let { uid } = req.params; // Extract 'uid' from params
        const currentUser = req.session["currentUser"]; // Get current user from session
    
        if (!currentUser) {
            res.sendStatus(401); // Unauthorized
            return;
        }
        // If the user is an ADMIN, return all courses
        if (currentUser.role === "ADMIN") {
            const courses = await courseDao.findAllCourses();
            res.json(courses);
            return;
        }
    
        // Assign 'uid' to the logged-in user's ID if 'uid' is "current"
        if (!uid || uid === "current") {
            uid = currentUser._id; // Set to the logged-in user's ID
        }
    
        try {
            // Fetch courses for the user based on enrollments
            const courses = await enrollmentsDao.findCoursesForUser(uid);
            res.json(courses);
        } catch (error) {
            console.error("Error fetching courses for user:", error);
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    };
          
    

    const createCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = await courseDao.createCourse(req.body);
        await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };

    const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
        res.send(status);
    };

    const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
    
        try {
            const result = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    
            if (result.deletedCount > 0) {
                // Successfully unenrolled
                return res.status(200).json({ message: "Successfully unenrolled" });
            } else {
                // No enrollment found to delete
                return res.status(404).json({ message: "Enrollment not found" });
            }
        } catch (error) {
            console.error("Error during unenrollment:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId", findUserById);
    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
}