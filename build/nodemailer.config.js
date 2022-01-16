"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmationEmail = void 0;
const nodemailer = require("nodemailer");
const user = "travel.addict.noreply@gmail.com";
const pass = "Traveladdict1";
const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass,
    },
});
// TODO EXPORT THIS METHOD TO AUTHSERVICE
function sendConfirmationEmail(email, confirmationCode) {
    const name = email.split('@')[0];
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing to travel addict ✈️. Please confirm your email by clicking on the following link 👇</p>
          <a href=http://localhost:8080/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
}
exports.sendConfirmationEmail = sendConfirmationEmail;
;
