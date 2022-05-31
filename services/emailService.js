const nodemailer = require("nodemailer");

// Gmail transporter

/*var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: `${process.env.email}`,
    pass: `${process.env.password}`,
  },
});*/

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  /* secure: false,
  requireTLS: true, */
  auth: {
    user: `${process.env.email}`,
    pass: `${process.env.password}`,
  },
});

// http://ethereal.email/ Transporter
//FIXME: ethereal email can crash the server sometimes don t use in defense !

/* const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: `${process.env.email}`,
    pass: `${process.env.password}`,
  },
}); */

const sendConfirmationEmail = (user, token) => {
  const url = `http://localhost:3000/confirmation/${token}`;

  transporter.sendMail({
    from: `${process.env.email}`,
    to: `${user.firstName} <${user.email}>`,
    subject: "Confirmation email",
    html: `Confirmation link <a href=${url}> ${url}</a>`,
  }),
    function (error, info) {
      if (error) {
        //console.log(error);
      } else {
        //console.log("email sent : " + info.response);
      }
    };
};

const sendResetEmail = (user) => {
  const url = `http://localhost:3000/newpassword/${user.resetPasswordToken}`;

  transporter.sendMail({
    from: `${process.env.email}`,
    to: `${user.username} <${user.email}>`,
    subject: "Reset password",
    html: `Reset password link <a href=${url}> ${url}</a>`,
  }),
    function (error, info) {
      if (error) {
        //console.log(error);
      } else {
        //console.log("email sent : " + info.response);
      }
    };
};

exports.sendConfirmationEmail = sendConfirmationEmail;
exports.sendResetEmail = sendResetEmail;
