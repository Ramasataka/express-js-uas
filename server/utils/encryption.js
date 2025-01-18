const crypto = require('crypto');
require('dotenv').config();

const KEY = process.env.ENCRYPTION_KEY;
const IV = process.env.ENCRYPTION_IV;

if (!KEY || !IV) {
    throw new Error('ENCRYPTION_KEY atau ENCRYPTION_IV belum diset di file .env');
}

function enkripsi(plaintext) {
    try {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(KEY, 'utf8'), Buffer.from(IV, 'utf8'));
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error('Error saat mengenkripsi:', error);
        throw error;
    }
}

function dekripsi(ciphertext) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(KEY, 'utf8'), Buffer.from(IV, 'utf8'));
        let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Error saat mendekripsi:', error);
        throw error;
    }
}

module.exports = {
    enkripsi,
    dekripsi
};