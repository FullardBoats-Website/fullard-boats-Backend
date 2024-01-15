require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add CORS middleware
app.use(cors());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // This email address sends the form
    pass: process.env.EMAIL_PASSWORD,
  },
});

// API endpoint for handling form submissions
app.post('/api/send-email', (req, res) => {
  const { name, email, phone, subject } = req.body;

  // Compose email content
  const mailOptions = {
    to: process.env.EMAIL_USERNAME, // This email address receives the form
    subject: 'Fullard Boats Contact Submission',
    text: `
      Full Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Subject: ${subject}
    `,
    replyTo: email,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`ExpressJS is running on port ${PORT}`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});