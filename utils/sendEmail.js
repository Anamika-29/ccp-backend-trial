import nodemailer from "nodemailer";

const html = `<h1>Hello World !</h1>`;

async function main() {
  try {
    const transporter = nodemailer.createTransport({
//       Server name: smtp.office365.com
// // Port: 587
// // Encryption method: STARTTLS
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // Use secure connection (TLS)
      auth: {
        user: 'nilay_cloud@hotmail.com',
        pass: 'Cloud_123',
      },
    });

    const mailOptions = {
      from: 'nilay_cloud@hotmail.com',
      to: "anamika.cloudogic@gmail.com",
      subject: "subject",
      text: 'This is a test email sent from Node.js and NodeMailer!',
      html: html,
    };

    // Use async/await to send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

main().catch(e => console.log(e));


// Server name: smtp.office365.com
// Port: 587
// Encryption method: STARTTLS