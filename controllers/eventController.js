import pool from "../config/database.js";

const getEvents = async (req, res) => {
    try {
        const query = `
            SELECT 
                e.id,
                e.title,
                e.description,
                TO_CHAR(e.date, 'YYYY-MM-DD') as date,
                TO_CHAR(e.start_time, 'HH24:MI') as start_time,
                TO_CHAR(e.end_time, 'HH24:MI') as end_time,
                json_agg(DISTINCT c.name) as classes,
                COALESCE(a.entry_status, 'absent') as entry_status,
                COALESCE(a.exit_status, 'absent') as exit_status
            FROM event e
            LEFT JOIN event_class ec ON e.id = ec.event_id
            LEFT JOIN class c ON ec.class_id = c.id
            LEFT JOIN attendance a ON e.id = a.event_id AND a.user_id = $1
            GROUP BY e.id, a.entry_status, a.exit_status
            ORDER BY e.date DESC, e.start_time
        `;

        const result = await pool.query(query, [req.user.id]);
        console.log("eventController: getEvents");
        console.table(result.rows);

        res.json(result.rows);
    } catch (err) {
        console.error("Error in getEvents:", err);
        res.status(500).json({ error: err.message });
    }
};

// Add this endpoint to your existing app.js

// Create event endpoint
const createEvent = async (req, res) => {
    // Check if user is staff
    if (req.user.role !== "staff") {
        return res.status(403).json({ error: "Only staff can create events" });
    }

    try {
        const { title, description, date, startTime, endTime, classes } =
            req.body;
        console.table(req.body);

        // Start a transaction
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Insert event
            const eventResult = await client.query(
                `INSERT INTO event (title, description, date, start_time, end_time)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, title, description, date, start_time, end_time`,
                [title, description, date, startTime, endTime]
            );

            console.log("Date: " + date);
            const eventId = eventResult.rows[0].id;

            // Get class IDs and insert event_class relationships
            for (const className of classes) {
                // Get class ID
                const classResult = await client.query(
                    "SELECT id FROM class WHERE name = $1",
                    [className]
                );

                if (classResult.rows.length > 0) {
                    const classId = classResult.rows[0].id;
                    // Insert event_class relationship
                    await client.query(
                        "INSERT INTO event_class (event_id, class_id) VALUES ($1, $2)",
                        [eventId, classId]
                    );
                }
            }

            // Initialize attendance records for all students in selected classes
            await client.query(
                `
                INSERT INTO attendance (event_id, user_id, entry_status, exit_status)
                SELECT $1, u.id, 'absent', 'absent'
                FROM users u
                JOIN class c ON u.class_id = c.id
                WHERE c.name = ANY($2)
                AND u.role = 'student'
            `,
                [eventId, classes]
            );

            await client.query("COMMIT");

            // Fetch the complete event data with classes
            const completeEventResult = await client.query(
                `
                SELECT 
                    e.*,
                    json_agg(DISTINCT c.name) as classes
                FROM event e
                LEFT JOIN event_class ec ON e.id = ec.event_id
                LEFT JOIN class c ON ec.class_id = c.id
                WHERE e.id = $1
                GROUP BY e.id
            `,
                [eventId]
            );

            res.json({
                success: true,
                message: "Event created successfully",
                event: completeEventResult.rows[0],
            });
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).json({
            success: false,
            error: "Failed to create event: " + err.message,
        });
    }
};

const getClass = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name FROM class ORDER BY name"
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { getEvents, createEvent, getClass };
