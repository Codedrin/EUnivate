import userMessage from '../../models/SuperAdmin/userMessage.js';
import nodemailer from 'nodemailer';

// Controller to handle contact requests
export const ContactEunivate = async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  // Save the request to the database
  try {
    const newRequest = new userMessage({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    });

    await newRequest.save();

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail App Password
      },
    });

    // Setup email options
    const mailOptions = {
      from: email,
      to: 'eunivate@gmail.com',
      subject: `New Contact Request: ${subject}`,
      text: `
        You have a new contact request from:

        First Name: ${firstName}
        Last Name: ${lastName}
        Email: ${email}
        Contact Number: ${phone}
        Subject: ${subject}
        Message: ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending email or saving request:', error);
    res.status(500).send('There was an error sending your message');
  }
};
