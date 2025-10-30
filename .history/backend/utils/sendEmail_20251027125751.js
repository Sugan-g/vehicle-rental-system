import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Vehicle Rental" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log("Email sent to:", to);
    } catch (err) {
        console.error("Email error:", err.message);
    }
};
