const Joi = require('joi');
const bcrypt = require('bcrypt');
const multer = require('multer');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const db = require('../connection'); 
const { enkripsi } = require('../utils/encryption'); 

// Validasi untuk Sign Up
const validateSignUp = Joi.object({
    email: Joi.string().email().max(254).required(),
    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol.',
        }),
    nama: Joi.string().regex(/^[a-zA-Z\s]+$/).min(3).max(100).required(),
    notelp: Joi.string().pattern(/^\+?\d{10,15}$/).required().messages({
        'string.pattern.base': 'Nomor tidak valid',
    }),
    alamatweb: Joi.string().uri().required().messages({
        'string.uri': 'Alamat web harus URL valid. Contoh: https://www.google.com',
    }),
    tempatlahir: Joi.string().regex(/^[a-zA-Z\s]+$/).max(100).required(),
    tanggallahir: Joi.date().iso().less('now').required().messages({
        'date.less': 'Tanggal lahir harus sebelum hari ini',
    }),
    nokk: Joi.string().length(16).regex(/^\d+$/).required(),
    noktp: Joi.string().length(16).regex(/^\d+$/).required(),
    foto: Joi.string().optional(),
    _csrf: Joi.string(),
});

// Validasi untuk Login
const validateLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    _csrf: Joi.string(),
});

// Fungsi untuk Sign Up
const signUp = async (req, res) => {
    try {

        // Validasi data input
        const { error, value } = validateSignUp.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        // Proses sanitasi dan penyimpanan data
        const sanitizedPass = xss(value.password);
        const hashPass = await bcrypt.hash(sanitizedPass, 10);

        const sanitizedEmail = enkripsi(xss(value.email));
        const sanitizedNama = enkripsi(xss(value.nama));
        const sanitizedNohp = enkripsi(xss(value.notelp));
        const sanitizedAlamatweb = enkripsi(xss(value.alamatweb));
        const sanitizedTempatlahir = enkripsi(xss(value.tempatlahir));
        const sanitizedTanggallahir = enkripsi(xss(value.tanggallahir));
        const sanitizedNokk = enkripsi(xss(value.nokk));
        const sanitizedNoktp = enkripsi(xss(value.noktp));
        const encryptedPhoto = req.file ? enkripsi(req.file.filename) : null;

        const query = `
            INSERT INTO user (email, password, nama, nohp, alamatweb, tempatlahir, tanggallahir, kk, ktp, foto, is_admin)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `;

        db.query(query, [
            sanitizedEmail,
            hashPass,
            sanitizedNama,
            sanitizedNohp,
            sanitizedAlamatweb,
            sanitizedTempatlahir,
            sanitizedTanggallahir,
            sanitizedNokk,
            sanitizedNoktp,
            encryptedPhoto,
        ]);

        res.status(201).json({ success: true, message: 'Pendaftaran berhasil!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk Login
const signIn = async (req, res) => {
    try {
        const { error, value } = validateLogin.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const sanitizedEmail = enkripsi(xss(value.email));
        const sanitizedPass = xss(value.password);

        const query = `SELECT * FROM user WHERE email = ?`;
        db.query(query, [sanitizedEmail], async (err, result) => {
            if (err || result.length === 0) {
                return res.status(401).json({ success: false, message: 'Email atau password salah.' });
            }

            const user = result[0];
            const passwordMatch = await bcrypt.compare(sanitizedPass, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ success: false, message: 'Email atau password salah.' });
            }

            const isAdmin = user.is_admin === 1;
            const role = user.is_admin;
            const id = user.id;

            const tokenPayload = {
                email: user.email,
                id: user.id,
            };

            
            
            // Membuat JWT
            const token = jwt.sign(tokenPayload, process.env.KUNCI_RAHASIA);

            res.cookie('authToken', token);

            res.status(200).json({
                success: true,
                message: isAdmin ? 'Login berhasil sebagai Admin!' : 'Login berhasil sebagai User!',
                role: role,
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
};

// Fungsi untuk Logout
const logout = (req, res) => {
    res.clearCookie('authToken');
    res.status(200).json({ success: true, message: 'Logout berhasil!' });
};

module.exports = { signUp, signIn, logout };
