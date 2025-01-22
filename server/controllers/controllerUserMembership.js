const Joi = require('joi');
const multer = require('multer');
const xss = require('xss');
const path = require('path');
const db = require('../connection');
const { enkripsi, dekripsi } = require('../utils/encryption');
//disini perubahan
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
                    COALESCE(um.status, 'not_purchased') AS status, -- Tambahkan status atau gunakan default 'not_purchased'
                    um.transaction_id,
                    um.order_id
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
            status: membership.status,
            transaction_id: membership.transaction_id ? dekripsi(membership.transaction_id) : null, // Dekripsi jika tidak null
            order_id: membership.order_id ? dekripsi(membership.order_id) : null, // Dekripsi jika tidak null
        }));

        res.json({ success: true, memberships: decryptedResults });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


const getMembershipContent = async (req, res) => {
    try {
        const { membershipId } = req.params;

        // Query data dari tabel membership_content berdasarkan membershipId
        db.query(
            `SELECT id, title, description FROM membership_content WHERE membership_id = ?`,
            [membershipId],
            (err, membershipContents) => {
                if (err) {
                    console.error('Error querying membership_content:', err);
                    return res.status(500).json({ success: false, message: 'Database query error' });
                }

                if (membershipContents.length === 0) {
                    return res.status(404).json({ success: false, message: 'No membership content found' });
                }

                // Ambil semua content_id
                const contentIds = membershipContents.map(content => content.id);

                // Query data dari tabel img_content berdasarkan content_id
                db.query(
                    `SELECT content_id, img FROM img_content WHERE content_id IN (?)`,
                    [contentIds],
                    (err, imgContents) => {
                        if (err) {
                            console.error('Error querying img_content:', err);
                            return res.status(500).json({ success: false, message: 'Database query error' });
                        }

                        // Dekripsi semua data yang diperlukan
                        const decryptedMembershipContents = membershipContents.map(content => ({
                            id: content.id,
                            title: dekripsi(content.title),
                            description: dekripsi(content.description),
                            img: imgContents
                            .filter(img => img.content_id === content.id)
                            .map(img => `http://localhost:3000/uploads/content_images/${dekripsi(img.img)}`) // Menyesuaikan URL gambar
                        }));

                        res.status(200).json({
                            success: true,
                            data: decryptedMembershipContents,
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ success: false, message: 'Error fetching membership content' });
    }
};



module.exports = { getMembershipsUser, getMembershipContent };