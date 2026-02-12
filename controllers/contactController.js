import express from 'express';
import transporter from '../config/nodemailer.js';

export const sendContactInfo = async (req, res) => {
     const { email, comment } = req.body;
     try {
        if (!email || !comment) {
        return res.status(400).json({ error: "Email and comment are required." });
        }
      
      const mailOptions = {
      from: email,
      to: "yilkalenyew092@gmail.com",
      subject: "New Contact Form Submission",
      text: `Email: ${email}\nComment: ${comment}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    

    res.status(200).json({ success:true, message: "Message sent successfully!" });
        
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: "Failed to send message." });
     }
}