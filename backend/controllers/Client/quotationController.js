import Quotation from '../../models/SuperAdmin/quotationModel.js';
import quotationTokenModel from "../../models/SuperAdmin/quotationTokenModel.js";
import nodemailer from 'nodemailer';
import crypto from "crypto";
import verifyQuotationEmail from '../../utils/jwtUtils.js';


// Create and save quotation, generate token, and send verification email

export const createQuotation = async (req, res) => {
    const { name, email, phone, company, service, budget, additionalInfo } = req.body;

    try {
        // Create and save the quotation
        const quotation = new Quotation({
            name,
            email,
            phone,
            company,
            service,
            budget, 
            additionalInfo,
        });

        await quotation.save();
        console.log('Quotation saved successfully:', quotation);

        // Generate a token and save it
        const quotationToken = new quotationTokenModel({
            quotationId: quotation._id.toString(),
            quotationToken: crypto.randomBytes(16).toString('hex'),
        });

        await quotationToken.save();
        console.log('Quotation token saved successfully:', quotationToken);

        // Create verification link
        const verificationLink = `http://localhost:5000/api/users/quotation/confirm/${quotationToken.quotationToken}`;

        // Send the verification email
        try {
            await verifyQuotationEmail(email, verificationLink);
            console.log('Verification email sent successfully.');

            res.status(201).json({
                message: 'Quotation saved successfully, verification email sent, and completion email sent.',
                quotation,
            });
        } catch (emailError) {
            console.error('Mail send failed:', emailError);
            res.status(500).json({
                message: 'Quotation saved but failed to send verification or completion email',
                error: emailError.message,
            });
        }
    } catch (error) {
        console.error('Error saving quotation or token:', error);
        if (!res.headersSent) {
            res.status(400).json({
                message: 'Error saving quotation or token',
                error: error.message,
            });
        }
    }
};

export const confirmQuotationEmail = async (req, res) => {
    try {
        // Find the token in the database
        const quotationToken = await quotationTokenModel.findOne({
            quotationToken: req.params.quotationToken,
        });

        if (!quotationToken) {
            return res.status(400).send("Invalid or expired token.");
        }

        // Retrieve the quotation details using the quotationId
        const quotation = await Quotation.findById(quotationToken.quotationId);

        if (!quotation) {
            return res.status(400).send("Quotation not found.");
        }

        // Mark the quotation as verified
        await Quotation.updateOne(
            { _id: quotationToken.quotationId },
            { $set: { verified: true } }
        );
        
        // Delete the token after verification
        await quotationTokenModel.findByIdAndDelete(quotationToken._id);

        // Redirect to the completion page
        res.redirect('/quotation-complete?');

        // Send completion email
        const recipientEmail = 'eunivate@gmail.com'; // Replace with your target email address
        const subject = 'Quotation Request Completed';

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // Your Gmail App Password
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: subject,
            text: `
            You have a new quotation request from:

            Name: ${quotation.name}
            Company Name: ${quotation.company}
            Company Email: ${quotation.email}
            Contact Number: ${quotation.phone}

            Other info:

            Type of Service: ${quotation.service}
            Preferred Budget: ${quotation.budget}
            Additional Info: ${quotation.additionalInfo || 'N/A'}
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Completion email sent successfully.');

    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(400).send("An error occurred during email verification.");
    }
};

// Check if the quotation is verified
export const checkVerificationStatus = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        
        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        res.json({ verified: quotation.verified });
    } catch (error) {
        console.error('Error checking verification status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export default { createQuotation, confirmQuotationEmail, checkVerificationStatus };
