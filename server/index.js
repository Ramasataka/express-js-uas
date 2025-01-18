const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();
const corsOptions = {
    origin: "http://localhost:5500",
    credentials: true,
  }

  
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const csrfProtection = csrf({ cookie: true }); 
app.use(csrfProtection);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});