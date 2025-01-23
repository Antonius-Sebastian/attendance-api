import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
        return res.status(401).json({ error: "Access denied" });
    }

    try {
        const token = bearerHeader.split(" ")[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

export { verifyToken };
