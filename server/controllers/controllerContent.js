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
    const membershipId = req.params.id; // Mendapatkan ID membership dari parameter URL
    console.log('Membership ID:', membershipId); // Log ID membership untuk debugging

    try {
        // Query untuk mengambil data konten membership
        const getContentQuery = `
            SELECT mc.id, mc.title, mc.description, ic.img
            FROM membership_content mc
            LEFT JOIN img_content ic ON mc.id = ic.content_id
            WHERE mc.membership_id = ?
        `;
        
        db.query(getContentQuery, [membershipId], (err, result) => {
            if (err) {
                console.error('Database Error:', err); // Log error jika query gagal
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

            console.log('Content Data:', result); // Log hasil data yang ditemukan

            // Mengirimkan hasil data konten ke client
            res.status(200).json({
                success: true,
                data: result
            });
        });
    } catch (err) {
        console.error('Catch Error:', err); // Log error jika ada kesalahan dalam catch block
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};

module.exports = { addContentToMembership, getContentForMembership };