require('dotenv').config();
const midtransClient = require('midtrans-client');
const db = require('../connection.js');


const snap = new midtransClient.Snap({
    isProduction: false, 
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });


  const createTransactionToken = async (req, res) => {
    const { membershipId, userId } = req.body;
  
    // Ambil data membership
    const membership = await db.query('SELECT * FROM membership WHERE id = ?', [membershipId]);
  
    if (!membership.length) {
      return res.status(400).json({ success: false, message: 'Membership not found' });
    }
  
    const transactionDetails = {
      order_id: `ORDER-${new Date().getTime()}`,
      gross_amount: membership[0].harga,
    };
  
    const itemDetails = [{
      id: membershipId,
      price: membership[0].harga,
      quantity: 1,
      name: membership[0].nama_membership,
    }];
  
    const customerDetails = {
      first_name: req.user.nama,
      email: req.user.email,
      phone: req.user.nohp,
    };
  
    const transaction = {
      transaction_details: transactionDetails,
      item_details: itemDetails,
      customer_details: customerDetails,
    };
  
    try {
      // Create transaction token
      const chargeResponse = await snap.createTransaction(transaction);
  
      // Simpan status transaksi sebagai "pending"
      await db.query('UPDATE user_membership SET status = "pending" WHERE user_id = ? AND membership_id = ?', [userId, membershipId]);
  
      return res.json({
        success: true,
        token: chargeResponse.token,
        redirect_url: chargeResponse.redirect_url,
      });
    } catch (error) {
      console.error('Midtrans Error:', error);
      return res.status(500).json({ success: false, message: 'Payment transaction failed' });
    }
  };
  
  // Callback dari Midtrans untuk status pembayaran
  const handlePaymentCallback = async (req, res) => {
    const { order_id, transaction_status } = req.body;
  
    // Cek status transaksi di Midtrans
    if (transaction_status === 'capture') {
      // Pembayaran berhasil
      await db.query('UPDATE user_membership SET status = "paid" WHERE order_id = ?', [order_id]);
    } else if (transaction_status === 'deny' || transaction_status === 'expired') {
      // Pembayaran gagal
      await db.query('UPDATE user_membership SET status = "failed" WHERE order_id = ?', [order_id]);
    } else if (transaction_status === 'cancel') {
      // Pembayaran dibatalkan
      await db.query('UPDATE user_membership SET status = "cancelled" WHERE order_id = ?', [order_id]);
    }
  
    res.json({ success: true });
  };
  
  module.exports = {
    createTransactionToken,
    handlePaymentCallback,
  };