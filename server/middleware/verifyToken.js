const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.KUNCI_RAHASIA;

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(403).json({ success: false, message: 'Token tidak ditemukan, akses ditolak' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Token tidak valid atau kedaluwarsa' });
        }

        req.user = decoded;

        next();
    });
};

module.exports = verifyToken;