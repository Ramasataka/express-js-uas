const express = require('express');
const bodyParser = require('body-parser');
const midtransService = require('./midtransService'); // Pastikan file ini sudah dibuat

const app = express();

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Endpoint untuk Midtrans callback
app.post('/transaction/midtransCallback', midtransService.handlePaymentCallback);


const PORT = 4000; 
app.listen(PORT, () => {
    console.log(`Midtrans callback server running on http://localhost:${PORT}`);
});
