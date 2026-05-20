import nodemailer from "nodemailer";

export const sendInvoiceEmail = async ({
   email,
   plan,
   amount,
   paymentId,
}) => {
   const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
      },
   });

   await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Plan Upgrade Successful",
      html: `
         <h2>Payment Successful</h2>

         <p>Plan: ${plan}</p>
         <p>Amount: ₹${amount / 100}</p>
         <p>Payment ID: ${paymentId}</p>

         <p>Thank you for upgrading.</p>
      `,
   });
};