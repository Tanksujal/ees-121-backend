const jwt = require('jsonwebtoken')
require ("dotenv").config();
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization || req.cookies.token;
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Access denied. No token provided.",
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send({
            success: false,
            message: "Invalid or expired token.",
            error: error.message,
        });
    }
};
const isAdmin = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized. No token provided.",
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid token. Authentication failed.",
                });
            }
            if (decoded.user.role !== "admin") {
                return res.status(403).send({
                    success: false,
                    message: "Access denied. Admins only.",
                });
            }
            req.user = decoded.user;
            next();
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "An error occurred while checking admin access.",
            error: error.message,
        });
    }
};
module.exports = {
    verifyToken,isAdmin
}