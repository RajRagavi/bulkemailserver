// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes'); 

dotenv.config();

const app = express();
connectDB();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

// Use email routes
app.use('/api', emailRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
