const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes'); 

dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Set up port
const port = process.env.PORT || 5000;

// Middlewareapp.use(cors());
const corsOptions = {
  origin: 'https://bulk-email-tool-tau.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};
app.use(cors(corsOptions));
app.use(express.json()); // Built-in middleware to parse JSON requests
app.use(bodyParser.json()); // Additional middleware to parse JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', emailRoutes);
app.get("/", (req,res) => {
  res.send("Server is Working")
})

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
