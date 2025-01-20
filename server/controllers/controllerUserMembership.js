const Joi = require('joi');
const multer = require('multer');
const xss = require('xss');
const path = require('path');
const db = require('../connection');
const { enkripsi, dekripsi } = require('../utils/encryption');

const getMembershipsUser = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId)
        const sql = `
            SELECT 
                m.id AS membership_id, 
                m.nama_membership, 
                m.harga, 
                m.img,
                CASE 
                    WHEN um.user_id IS NOT NULL THEN true
                    ELSE false
                END AS is_purchased
            FROM membership m
            LEFT JOIN user_membership um 
            ON m.id = um.membership_id AND um.user_id = ?
        `;

        const [results] = await db.promise().query(sql, [userId]);
        
        const decryptedResults = results.map((membership) => ({
            membership_id: membership.membership_id,
            nama_membership: dekripsi(membership.nama_membership),
            harga: dekripsi(membership.harga),
            img: `http://localhost:3000/uploads/membership_photo/${dekripsi(membership.img)}`,
            is_purchased: membership.is_purchased,
        }));

        res.json({ success: true, memberships: decryptedResults });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getMembershipsUser };