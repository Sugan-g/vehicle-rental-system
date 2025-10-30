import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export default async function sendEmail(to, subject, html) {
 
        console.log("📩 Email trigger skipped in development mode");
        console.log("To:", to);
        console.log("Subject:", subject);
        return true;
    }

}
