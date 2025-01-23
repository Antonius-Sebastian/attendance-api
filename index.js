import express from "express";
import "dotenv/config";
import {
    createEvent,
    getClass,
    getEvents,
} from "./controllers/eventController.js";
import { login } from "./controllers/authController.js";
import { verifyToken } from "./middleware/auth.js";
import {
    getEventAttendance,
    recordEntry,
    recordExit,
} from "./controllers/attendanceController.js";

const app = express();

app.use(express.json());

app.post("/api/auth/login", login);
app.get("/api/events", verifyToken, getEvents);
app.post("/api/attendance/entry", verifyToken, recordEntry);
app.post("/api/attendance/exit", verifyToken, recordExit);
app.get("/api/attendance/:eventId", verifyToken, getEventAttendance);
app.post("/api/events", verifyToken, createEvent);
app.get("/api/classes", verifyToken, getClass);

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on port: ${PORT}`);
});

// ngrok http --url=model-strictly-swift.ngrok-free.app 3000
