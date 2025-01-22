require('dotenv').config();
const midtransClient = require('midtrans-client');
const db = require('../connection.js');
const { enkripsi, dekripsi } = require('../utils/encryption');


const snap = new midtransClient.Snap({
    isProduction: false, 
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });


  const createTransactionToken = (req, res) => {
    const { membershipId, userId } = req.body;
  
    // Ambil data membership
    db.query('SELECT * FROM membership WHERE id = ?', [membershipId], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ success: false, message: 'Database query failed' });
      }
  
      if (results.length === 0) {
        return res.status(400).json({ success: false, message: 'Membership not found' });
      }
  
      const membership = results[0];
      const decryptedMembership = {
        id: membership.id,
        nama_membership: dekripsi(membership.nama_membership),
        harga: dekripsi(membership.harga),
        img: dekripsi(membership.img)
      };
      const transactionDetails = {
        order_id: `ORDER-${new Date().getTime()}`,
        gross_amount: decryptedMembership.harga,
      };
  
      const itemDetails = [{
        id: membershipId,
        price: decryptedMembership.harga,
        quantity: 1,
        name: decryptedMembership.nama_membership,
      }];
      
  
      const customerDetails = {
        first_name: req.user.nama,
        email: dekripsi(req.user.email),
        phone: req.user.nohp,
      };
  
      const transaction = {
        transaction_details: transactionDetails,
        item_details: itemDetails,
        customer_details: customerDetails,
      };
  
      // Buat token transaksi melalui Midtrans
      snap.createTransaction(transaction)
        .then((chargeResponse) => {
        
          db.query(
            'INSERT INTO user_membership (user_id, membership_id, status, order_id, transaction_id) VALUES (?, ?, "pending", ?, ?)',
            [req.user.id, membershipId, enkripsi(transactionDetails.order_id), enkripsi(chargeResponse.redirect_url)],
            (insertErr) => {
              if (insertErr) {
                console.error('Database Insert Error:', insertErr);
                return res.status(500).json({ success: false, message: 'Failed to create new transaction' });
              }
          
              return res.json({
                success: true,
                token: chargeResponse.token,
                redirect_url: chargeResponse.redirect_url,
              });
            }
          );
        })
        .catch((error) => {
          console.error('Midtrans Error:', error);
          return res.status(500).json({ success: false, message: 'Payment transaction failed' });
        });
    });
  };
  
  
  // Callback dari Midtrans untuk status pembayaran
  const handlePaymentCallback = (req, res) => {
    const { order_id, transaction_status } = req.body;
  
    let status;
    if (transaction_status === 'settlement') {
      status = 'paid';
    } else if (transaction_status === 'deny' || transaction_status === 'expired') {
      status = 'failed';
    } else if (transaction_status === 'cancel') {
      status = 'cancelled';
    } else {
      return res.status(400).json({ success: false, message: 'Unknown transaction status' });
    }
  
    db.query(
      'UPDATE user_membership SET status = ? WHERE order_id = ?',
      [status, enkripsi(order_id)],
      (err) => {
        if (err) {
          console.error('Database Update Error:', err);
          return res.status(500).json({ success: false, message: 'Failed to update transaction status' });
        }
  
        return res.json({ success: true });
      }
    );
  };
  
  
  module.exports = {
    createTransactionToken,
    handlePaymentCallback,
  };