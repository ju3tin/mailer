var express = require('express');
var cors = require('cors')
var nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer();
/*
 * Configurations
 */
const allowedOrigin = ["https://adafycheng.github.io","http://localhost:5000","*"];
const emailUser = 'fandlkitchens@gmail.com';
const password = 'owvozapcjtqwfzdw';

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: emailUser,
    pass: password
  },
  tls: {
    rejectUnauthorized: false
  }
});
// End Configurations

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("/index.html", {root: 'public'});
  });

  app.get("/dude", (req, res) => {
    res.sendFile("/index3.html", {root: 'public'});
  });

// Middleware function
app.get("*", function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

var corsOptions = {
  origin: allowedOrigin,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Post params
app.post("/contact", cors(corsOptions), function(req, res, next) {
  const body = req.body;
  console.log('form data', body);
  let fromEmail = emailUser;
  let fromName = "dudehh";
  let toEmail = "ju3tin@hotmail.co.uk";
  let emailSubject = 'Email sent from Portfolio Website';
  let message = "hello world";

  let mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: emailSubject,
    html: '<p>Message from <strong>' + fromName + ' (' + fromEmail + ')</strong></p><p>' + message + '</p>'
  };

  // Send the email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  return res.redirect("/success.html");
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});