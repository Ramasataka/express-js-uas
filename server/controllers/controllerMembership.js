const Joi = require('joi');
const multer = require('multer');
const xss = require('xss');
const fs = require('fs');
const path = require('path');
const db = require('../connection');
require('dotenv').config();
const { enkripsi, dekripsi } = require('../utils/encryption');

const validateMembership = Joi.object({
    nama_membership: Joi.string().min(3).max(100).required(),
    harga: Joi.string().regex(/^\d+$/).required(),
    img: Joi.string().optional(),
    _csrf: Joi.string()
});

const addMembership = async (req, res) => {
    try {
        const { error, value } = validateMembership.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const sanitizedNamaMembership = enkripsi(xss(value.nama_membership));
        const sanitizedHarga = enkripsi(xss(value.harga));
        let encryptedImg = null;

        if (req.file) {
            encryptedImg = enkripsi(req.file.filename);
        }

        const query = `INSERT INTO membership (nama_membership, harga, img) VALUES (?, ?, ?)`;

        db.query(query, [sanitizedNamaMembership, sanitizedHarga, encryptedImg], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: 'Gagal menyimpan data membership'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Membership berhasil ditambahkan'
            });
        });
    } catch (err) {
        console.error(err);

        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: 'Error saat mengunggah file: ' + err.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};

const updateMembership = async (req, res) => {
    const membershipId = req.params.id;
    const { error, value } = validateMembership.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const encryptedNamaMembership = enkripsi(xss(value.nama_membership));
    const encryptedHarga = enkripsi(xss(value.harga));
    const encryptedImg = req.file ? enkripsi(req.file.filename) : null;

    // Query untuk mendapatkan nama file gambar lama
    const selectQuery = `SELECT img FROM membership WHERE id = ?`;
    db.query(selectQuery, [membershipId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat mengambil data membership'
            });
        }

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Membership dengan id tersebut tidak ditemukan'
            });
        }

        const oldImg = dekripsi(rows[0].img);

        // Update query
        const updateQuery = `
            UPDATE membership 
            SET nama_membership = ?, harga = ?, img = COALESCE(?, img)
            WHERE id = ?
        `;

        db.query(updateQuery, [encryptedNamaMembership, encryptedHarga, encryptedImg, membershipId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: 'Terjadi kesalahan saat memperbarui data membership'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Membership dengan id tersebut tidak ditemukan'
                });
            }

            // Hapus file lama jika ada dan file baru diunggah
            if (req.file && oldImg) {
                const oldImgPath = path.join(__dirname, '..', 'uploads', 'membership_photo', oldImg);
                fs.unlink(oldImgPath, (err) => {
                    if (err) {
                        console.error(`Gagal menghapus file lama: ${oldImgPath}`, err);
                    }
                });
            }

            res.status(200).json({
                success: true,
                message: 'Membership telah diperbarui'
            });
        });
    });
};

const getMembership = async (req, res) => {
    const query = `SELECT * FROM membership`;

    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Gagal menampilkan data wir'
            });
        }

        const hasilDekripsi = result.map(row => ({
            id : row.id,
            nama_membership : dekripsi(row.nama_membership),
            harga : dekripsi(row.harga),
            img : `http://localhost:3000/uploads/membership_photo/${dekripsi(row.img)}`
        }))

        res.status(200).json({
            success: true,
            message: 'berhahsil menampilkan data wir',
            data: hasilDekripsi

        })

    })
}

const deleteMembership = async (req, res) => {
    const membershipId = req.params.id;

    // Query untuk mendapatkan path gambar
    const selectQuery = `SELECT img FROM membership WHERE id = ?`;

    db.query(selectQuery, [membershipId], (selectErr, selectResult) => {
        if (selectErr) {
            console.error(selectErr);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat mengambil data membership',
            });
        }

        if (selectResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Membership dengan id tersebut tidak ditemukan',
            });
        }

        const imagePath = dekripsi(selectResult[0].img); 
        const filePath = path.join(__dirname, '../uploads/membership_photo/', imagePath); 
        // Hapus data membership
        const deleteQuery = `DELETE FROM membership WHERE id = ?`;
        db.query(deleteQuery, [membershipId], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error(deleteErr);
                return res.status(500).json({
                    success: false,
                    message: 'Terjadi kesalahan saat menghapus data membership',
                });
            }

            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Membership dengan id tersebut tidak ditemukan',
                });
            }

            // Hapus file gambar jika ada
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error saat menghapus file:', unlinkErr);
                    // Tidak perlu menghentikan proses jika file tidak ditemukan
                }
            });

            res.status(200).json({
                success: true,
                message: 'Membership berhasil dihapus beserta gambar',
            });
        });
    });
};

const getSingleMembership = async (req, res) => {
    const membershipId = req.params.id;

    const query = `SELECT id, nama_membership, harga, img FROM membership WHERE id = ?`;

    db.query(query, [membershipId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat mengambil data membership'
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Membership dengan id tersebut tidak ditemukan'
            });
        }
        const hasilDekripsi = {
            id: result[0].id,
            nama_membership: dekripsi(result[0].nama_membership),
            harga: dekripsi(result[0].harga),
            img: result[0].img
                ? `http://localhost:3000/uploads/membership_photo/${dekripsi(result[0].img)}`
                : null
        };

        res.status(200).json({
            success: true,
            message: 'Berhasil menampilkan data membership',
            data: hasilDekripsi
        });
    });
};

module.exports = { getMembership, addMembership, updateMembership, deleteMembership, getSingleMembership };