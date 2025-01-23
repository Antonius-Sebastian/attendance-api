import pool from "../config/database.js";

const recordEntry = async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        if (req.user.role !== "staff") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        const result = await pool.query(
            `
            UPDATE attendance 
            SET entry_status = 'present'
            WHERE event_id = $1 AND user_id = $2
            RETURNING *
        `,
            [eventId, userId]
        );
        console.log(result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found",
            });
        }

        res.json({
            success: true,
            message: "Entry attendance recorded successfully",
            eventId: result.rows[0].event_id,
            userId: result.rows[0].user_id,
            entryStatus: result.rows[0].entry_status,
            exitStatus: result.rows[0].exit_status,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error recording attendance: " + err.message,
        });
    }
};

const recordExit = async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        if (req.user.role !== "staff") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        const result = await pool.query(
            `
            UPDATE attendance 
            SET exit_status = 'present'
            WHERE event_id = $1 
            AND user_id = $2
            AND entry_status = 'present'
            RETURNING *
        `,
            [eventId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No entry record found or student has not entered",
            });
        }

        res.json({
            success: true,
            message: "Exit attendance recorded successfully",
            eventId: result.rows[0].event_id,
            userId: result.rows[0].user_id,
            entryStatus: result.rows[0].entry_status,
            exitStatus: result.rows[0].exit_status,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error recording attendance: " + err.message,
        });
    }
};

// Get attendance report for an event
const getEventAttendance = async (req, res) => {
    try {
        if (req.user.role !== "staff") {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        const result = await pool.query(
            `
            SELECT 
                u.name as student_name,
                c.name as class_name,
                a.entry_status,
                a.exit_status
            FROM users u
            JOIN class c ON u.class_id = c.id
            JOIN event_class ec ON c.id = ec.class_id
            LEFT JOIN attendance a ON u.id = a.user_id AND a.event_id = $1
            WHERE ec.event_id = $1 AND u.role = 'student'
            ORDER BY c.name, u.name
        `,
            [req.params.eventId]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export { recordEntry, recordExit, getEventAttendance };
