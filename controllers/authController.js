import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query(
            "SELECT users.*, class.name as class_name FROM users LEFT JOIN class ON users.class_id = class.id WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({ error: "Invalid pass" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, class_id: user.class_id },
            process.env.JWT_SECRET,
            { expiresIn: "168h" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                class_id: user.class_id,
                class_name: user.class_name,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { login };
