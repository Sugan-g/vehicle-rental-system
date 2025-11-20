import dotenv from "dotenv";
import nodemailer from "nodemailer";
import dns from "dns";

// Fix IPv6 timeout issue on Render
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // enable STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default async function sendEmail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: `"Vehicle Rental" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent successfully to:", to);
        return true;
    } catch (error) {
        console.error("Email sending error:", error);
        return false;
    }
}
