const Joi = require('joi');
const multer = require('multer');
const xss = require('xss');
const fs = require('fs');
const path = require('path');
const db = require('../connection');
require('dotenv').config();
const { enkripsi, dekripsi } = require('../utils/encryption');

const validateMembership = Joi.object({
    membershipId: Joi.string().required(),
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(100).required(),
    img: Joi.string().optional(),
    _csrf: Joi.string()
});

const addContentToMembership = async (req, res) => {
    console.log('Request received'); // Log pertama

    const membershipId = req.params.id; // ID membership
    console.log('Membership ID:', membershipId); // Log ID Membership

    const { error, value } = validateMembership.validate(req.body);
    if (error) {
        console.log('Validation Error:', error.details); // Log error validasi
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    console.log('Validated Input:', value); // Log nilai yang divalidasi

    try {
        // Enkripsi data
        const encryptedTitle = enkripsi(xss(value.title));
        const encryptedDescription = enkripsi(xss(value.description));

        console.log('Encrypted Data:', encryptedTitle, encryptedDescription); // Log hasil enkripsi

        // Simpan konten ke `membership_content`
        const insertContentQuery = `
            INSERT INTO membership_content (membership_id, title, description)
            VALUES (?, ?, ?)
        `;
        db.query(insertContentQuery, [membershipId, encryptedTitle, encryptedDescription], (err, result) => {
            if (err) {
                console.error('Database Error:', err); // Log error database
                return res.status(500).json({
                    success: false,
                    message: 'Gagal menambahkan konten ke membership'
                });
            }

            const contentId = result.insertId; // ID dari konten yang baru ditambahkan
            console.log('Content Inserted, ID:', contentId); // Log ID konten

            if (req.files && req.files.length > 0) {
                const insertImageQuery = `
                    INSERT INTO img_content (content_id, img)
                    VALUES (?, ?)
                `;

                // Simpan gambar
                const imagePromises = req.files.map((file) => {
                    const encryptedImg = enkripsi(file.filename);
                    return new Promise((resolve, reject) => {
                        db.query(insertImageQuery, [contentId, encryptedImg], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                });

                // Tunggu semua gambar selesai disimpan
                Promise.all(imagePromises)
                    .then(() => {
                        console.log('All Images Saved');
                        res.status(201).json({
                            success: true,
                            message: 'Konten dan semua gambar berhasil ditambahkan',
                            data: {
                                membership_id: membershipId,
                                content_id: contentId
                            }
                        });
                    })
                    .catch((err) => {
                        console.error('Error Saving Images:', err); // Log error gambar
                        res.status(500).json({
                            success: false,
                            message: 'Gagal menyimpan gambar konten'
                        });
                    });
            } else {
                res.status(201).json({
                    success: true,
                    message: 'Konten berhasil ditambahkan tanpa gambar',
                    data: {
                        membership_id: membershipId,
                        content_id: contentId
                    }
                });
            }
        });
    } catch (err) {
        console.error('Catch Error:', err); // Log error
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};


const getContentForMembership = async (req, res) => {
    const membershipId = req.params.id;

    try {
        // Query untuk mengambil konten dan gambar terkait
        const getContentQuery = `
            SELECT mc.id, mc.title, mc.description, ic.img
            FROM membership_content mc
            LEFT JOIN img_content ic ON mc.id = ic.content_id
            WHERE mc.membership_id = ?
        `;
        
        db.query(getContentQuery, [membershipId], (err, result) => {
            if (err) {
                console.error('Database Error:', err)
                return res.status(500).json({
                    success: false,
                    message: 'Gagal mengambil konten untuk membership'
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Konten untuk membership ini tidak ditemukan'
                });
            }

            // Mengelompokkan gambar per konten
            const contentMap = {};
            result.forEach(item => {
                // Dekripsi data konten
                const contentId = item.id;
                if (!contentMap[contentId]) {
                    contentMap[contentId] = {
                        id: contentId,
                        title: dekripsi(item.title),
                        description: dekripsi(item.description),
                        images: []
                    };
                }
                if (item.img) {
                    contentMap[contentId].images.push(`http://localhost:3000/uploads/content_images/${dekripsi(item.img)}`);
                }
            });

            // Mengonversi contentMap ke array
            const decryptedData = Object.values(contentMap);

            // Log hasil data yang akan dikirim
            console.log('Data yang akan dikirim:', decryptedData);

            // Mengirimkan hasil data konten yang sudah didekripsi
            res.status(200).json({
                success: true,
                data: decryptedData
            });
        });
    } catch (err) {
        console.error('Catch Error:', err);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};

const deleteContent = async (req, res) => {
    const contentId = req.params.id;

    try {
        // First, delete the associated images from img_content table
        const deleteImagesQuery = `
            DELETE FROM img_content WHERE content_id = ?
        `;
        db.query(deleteImagesQuery, [contentId], (err) => {
            if (err) {
                console.error('Error deleting images:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error deleting images'
                });
            }

            // Now, delete the content itself from membership_content table
            const deleteContentQuery = `
                DELETE FROM membership_content WHERE id = ?
            `;
            db.query(deleteContentQuery, [contentId], (err, result) => {
                if (err) {
                    console.error('Error deleting content:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting content'
                    });
                }

                // If content was deleted
                if (result.affectedRows > 0) {
                    return res.status(200).json({
                        success: true,
                        message: 'Content deleted successfully'
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: 'Content not found'
                    });
                }
            });
        });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


module.exports = { addContentToMembership, getContentForMembership, deleteContent };





//npx http-server -p 5500

