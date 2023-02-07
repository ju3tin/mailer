// Import express into our project
const express = require("express");
var request = require('request');
var cors = require('cors')
var nodemailert = require('nodemailer');
// Import multer

const bodyParser = require("body-parser");
// require database connection 
const dbConnect = require("./db/dbConnect");

// execute database connection 
dbConnect();

const allowedOrigin = ["https://adafycheng.github.io","http://localhost:5000","*"];
const emailUser = 'fandlkitchens@gmail.com';
const password = 'owvozapcjtqwfzdw';



const multer = require("multer");

// Creating an instance of express function
const app = express();

// Import dotenv
require("dotenv").config();

// The port we want our project to run on
const PORT = 3000;

// Express should add our path -middleware
app.use(express.static("public"));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Nodemailer
const nodemailer = require("nodemailer");


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
// FS
const fs = require("fs");

// Googleapis
const { google } = require("googleapis");
// Pull out OAuth from googleapis
const OAuth2 = google.auth.OAuth2;

// Multer file storage
const Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./attachments");
  },
  filename: function (req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

// Middleware to get attachments
const attachmentUpload = multer({
  storage: Storage,
}).single("attachment");

const createTransporter = async () => {
  //Connect to the oauth playground
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  // Add the refresh token to the Oauth2 connection
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token : error message(" + err);
      }
      resolve(token);
    });
  });

  // Authenticating and creating a method to send a mail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SENDER_EMAIL,
      accessToken,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  return transporter;
};

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Root directory -homepage
app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

app.get("/dude", (req, res) => {
    res.sendFile("/index3.html", {root: 'public'});
  });

// Route to handle sending mails
app.post("/send_email", (req, res) => {
  attachmentUpload(req, res, async function (error) {
    if (error) {
      return res.send("Error uploading file");
    } else {
      // Pulling out the form data from the request body
      const recipient = req.body.email;
      const mailSubject = req.body.subject;
      const mailBody = req.body.message;
      const attachmentPath = req.file?.path;

      // Mail options
      let mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: recipient,
        subject: mailSubject,
        text: mailBody,
        attachments: [
          {
            path: attachmentPath,
          },
        ],
      };

      try {
        // Get response from the createTransport
        let emailTransporter = await createTransporter();

        // Send email
        emailTransporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            // failed block
            console.log(error);
          } else {
            // Success block
            console.log("Email sent: " + info.response);

            // Delete file from the folder after sent
            fs.unlink(attachmentPath, function (err) {
              if (err) {
                return res.end(err);
              } else {
                console.log(attachmentPath + " has been deleted");
                return res.redirect("/success.html");
              }
            });
          }
        });
      } catch (error) {
        return console.log(error);
      }
    }
  });
});

var corsOptions = {
    origin: allowedOrigin,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  
  // Post params
  app.post("/contact", cors(corsOptions), function(req, res, next) {
    {if(req.body.parking === "Yes"){ req.body.duder1 = true}else{ req.body.duder1 = false}};
    {if(req.body.fittersrequired === "Yes"){ req.body.duder2 = true}else{ req.body.duder2 = false}};
    let fruits = [];
    {if(req.body.fridges === "Fridge Required"){fruits.push("fridges")}};
    {if(req.body.freezers === "Freezer Required"){fruits.push("freezers")}};
    {if(req.body.ovens === "Oven Required"){fruits.push("ovens")}};
    {if(req.body.hobs === "Hob Required"){fruits.push("hobs")}};
    {if(req.body.microwaves === "Microwave Required"){fruits.push("microwaves")}};
    {if(req.body.extractors === "Extractor Required"){fruits.push("extractors")}};
    {if(req.body.sinks === "Sinks Required"){fruits.push("sinks")}};
    {if(req.body.washingmachine === "Washing Machine Required"){fruits.push("washingmachine")}};
    {if(req.body.dryer === "Dryer Required"){fruits.push("dryer")}};
    {if(req.body.winecooler === "Wine Cooler Required"){fruits.push("winecooler")}};
    let myJSONObject = {
    "fullname":req.body.fullname,
    "doornumber":req.body.doornumber,
    "roadname":req.body.roadname,
    "town":req.body.town,
    "postcode":req.body.postcode,
    "phonenumber":req.body.phonenumber,
    "email":req.body.email,
    "buildersname":req.body.buildersname,
    "parking":req.body.duder1,
    "projecttype":req.body.projecttype,
    "kitchenstyle":req.body.kitchenstyle,
    "worktopstyle":req.body.worktopstyle,
    "fittersrequired":req.body.duder2,
    "pricerange":req.body.pricerange,
    "kitchencolour":req.body.kitchencolour,
    "timescale":req.body.timescale,
    "dontwantstatement":req.body.dontwantstatement,
    "hearaboutus":req.body.hearaboutus,
    "options":fruits

};
    const body = req.body;
    console.log(body);
    let fromEmail = emailUser;
    let fromName = "F and L Kitchens";
    let toEmail = req.body.email;
    let emailSubject = 'Email sent from Quotes for F and L Kitchens';
    let message = "hello world";
  
    let mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: emailSubject,
      //html: '<p>Message from <strong>' + fromName + ' (' + fromEmail + ')</strong></p><p>' + message + '</p>'
      html: `<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin-top: 30px; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; padding: 0;"
      bgcolor="#D5E2EC">
  
  <!-- WRAPPER -->
  <!-- Set wrapper width (twice) -->
  <table border="0" cellpadding="0" cellspacing="0" align="center"
      width="700" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
      max-width: 700px;" class="wrapper">
  
      <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
              padding-top: 20px;
              padding-bottom: 20px;">
              
              <!-- LOGO -->
              <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2. URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content=logo&utm_campaign={{Campaign-Name}} -->
              <a target="_blank" style="text-decoration: none;"
                  href="https://www.fandlkitchens.co.uk/"><img border="0" vspace="0" hspace="0"
                  src="https://ju3tin.github.io/images/logoedit.png"
                  width="100" height="100"
                  alt="Logo" title="Logo" style="
                  color: #303344;
                  font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block; " /></a>
  
          </td>
      </tr>
  
  <!-- End of WRAPPER -->
  </table>
  
  <!-- WRAPPER / CONTEINER -->
  <!-- Set conteiner background color -->
  <table border="0" cellpadding="0" cellspacing="0" align="center"
      bgcolor="#FFFFFF"
      width="700" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit; 
      max-width: 700px;" class="container">
  
      <!-- HEADER -->
      <!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
      <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 8%; padding-right: 8%; width: 87.5%; font-size: 36px; font-weight: bold; line-height: 130%;
              text-align: left;
              padding-top: 70px;
              color: #303344;
              font-family: 'Arial', sans-serif;" class="header">
                  Your Quote Reminder
          </td>
      </tr>
      <!-- PARAGRAPH -->
      <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
      <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 8%; padding-right: 8%; width: 87.5%; font-size: 18px; font-weight: 400; line-height: 160%; text-align: left;
              padding-top: 30px; 
              color: #525c6c;
              font-family: 'Arial', sans-serif;" class="paragraph">
                  Dear `+req.body.fullname+`,
              <br><br>
                  We wanted to let you know we got your quote. Below is a list of all the varibles you asked for. 
          </td>
      </tr>
  
      <!-- LINE -->
      <!-- Set line color -->
      <tr>	
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 8%; padding-right: 8%; width: 87.5%;
              padding-top: 50px;" class="line">
          </td>
      </tr>	
      <!-- LIST -->
      <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 8%; padding-right: 8%;" class="list-item"><table align="center" border="0" cellspacing="0" cellpadding="0" style="width: 100%; margin: 0; padding: 0; border-collapse: collapse; border-spacing: 0;">
              <tr td align="left" valign="top" style="font-size: 13px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                      text-align: left;
                      padding-top: 30px;
                      color: #7d8d9e;
                      text-transform: uppercase;
                      font-family: 'Arial', sans-serif;;" class="paragraph">
                  <th scope="col" style="padding-bottom: 10px;">Varible Title</th>
                  <th scope="col" style="padding-bottom: 10px;">Varible Name</th>
              </tr>
              
              <!-- LIST ITEM -->
              <tr align="left" valign="top" style="font-size: 18px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                      text-align: left;
                      padding-top: 30px;
                      color: #303344;
                      font-family: 'Arial', sans-serif;;" class="paragraph">
                  <!-- LIST ITEM TEXT -->
                  <td style="padding: 20px 0 10px;">Bob's Burgers</td>
                  <td style="padding: 20px 0 10px;">10/29/2018</td>

              </tr>
              <!-- LIST ITEM -->
              <tr align="left" valign="top" style="font-size: 18px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
              text-align: left;
              padding-top: 30px;
              color: #303344;
              font-family: 'Arial', sans-serif;;" class="paragraph">
              <!-- LIST ITEM TEXT -->
              <td style="padding: 20px 0 10px;">`+req.body.email+`</td>
              <td style="padding: 20px 0 10px;">10/29/2018</td>
              </tr>

              <tr align="left" valign="top" style="font-size: 18px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                      text-align: left;
                      padding-top: 30px;
                      color: #303344;
                      font-family: 'Arial', sans-serif;;" class="paragraph">
                  <!-- LIST ITEM TEXT -->
                  <td style="padding: 20px 0 10px;">Bob's Burgers</td>
                  <td style="padding: 20px 0 10px;">10/29/2018</td>
              </tr>
              <!-- LIST ITEM -->
              <tr align="left" valign="top" style="font-size: 18px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                      text-align: left;
                      padding-top: 30px;
                      color: #303344;
                      font-family: 'Arial', sans-serif;;" class="paragraph">
                  <!-- LIST ITEM TEXT -->
                  <td style="padding: 20px 0 10px;">Bob's Burgers</td>
                  <td style="padding: 20px 0 10px;">10/29/2018</td>
                  <td align="right" style="padding: 20px 0 10px;">$2,108</td>
                 <!-- <td align="right" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-top: 10px; width: auto;" class="button"><a
              href="{{quote_link}}" target="_blank" style="text-decoration: none;">
                  <table border="0" cellpadding="0" cellspacing="0" align="right" style="border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="padding: 8px 15px; margin: 0; text-decoration: none; border-collapse: collapse; border-spacing: 0; border-radius: 2px; -webkit-border-radius: 2px; -moz-border-radius: 2px; -khtml-border-radius: 2px;"
                      bgcolor=""><a target="_blank" style="text-decoration: none;
                      color: #4579FF; font-family: 'Arial', sans-serif; font-size: 16px; font-weight: 600; line-height: 120%;"
                      href="https://app.attuneinsurance.com">
                      View quote
                      </a>
              </td></tr></table></a>
          </td>-->
              </tr>
  
          </table></td>
      </tr>
          <!-- BUTTON -->
      <!-- Set button background color at TD, link/text color at A and TD, font family ("sans-serif" or "Georgia, serif") at TD. For verification codes add "letter-spacing: 5px;". Link format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Button-Name}}&utm_campaign={{Campaign-Name}} -->
  <!-- 	<tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 8%; padding-right: 8%; width: 87.5%;
              padding-top: 50px;
              padding-bottom: 5px;" class="button"><a
              href="https://github.com/konsav/email-templates/" target="_blank" style="text-decoration: none;">
                  <table border="0" cellpadding="0" cellspacing="0" align="center" style="width: 100%; border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="padding: 18px 24px; margin: 0; text-decoration: none; border-collapse: collapse; border-spacing: 0; border-radius: 2px; -webkit-border-radius: 2px; -moz-border-radius: 2px; -khtml-border-radius: 2px;"
                      bgcolor="#4579FF"><a target="_blank" style="text-decoration: none;
                      color: #FFFFFF; font-family: 'Arial', sans-serif; font-size: 18px; font-weight: 600; line-height: 120%;"
                      href="https://www.fandlkitchens.co.uk/">
                      Review quotes
                      </a>
              </td></tr></table></a>
          </td>
      </tr> -->
  
      <!-- PARAGRAPH -->
      <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
      <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 16px; font-weight: 400; line-height: 160%;
              padding-top: 30px;
              padding-bottom: 15px;
              color: #525c6c;
              font-family: 'Arial', sans-serif;" class="paragraph">
                  Questions? <a href="mailto:Info@fandlsupplies.co.uk" target="_blank" style="color: #4579FF; font-family: 'Arial', sans-serif; font-size: 16px; font-weight: 400; line-height: 160%;">Info@fandlsupplies.co.uk</a> | 447780116170
          </td>
      </tr>
      <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 16px; font-weight: 400; line-height: 160%;
              padding-top: 0px;
              padding-bottom: 30px;
              color: #7d8d9e;
              font-family: 'Arial', sans-serif;" class="paragraph">© F&L Kitchens Ltd. 2023</td>
      </tr>
      
  
  <!-- End of WRAPPER -->
  </table>
  
  <!-- WRAPPER -->
  <!-- Set wrapper width (twice) -->

  
  <!-- End of SECTION / BACKGROUND -->
  </td></tr></table>
  <p></p>`
    };
    request({
        url: "http://localhost:3000/api/quotes",
        method: "POST",
        json: true,   // <--Very important!!!
        body: myJSONObject
    }, function (error, response, body){
       // console.log(response);
    });

  
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

  require("./app/routes/quote.routes")(app);
// Express allows us to listen to the port and trigger a console.log() when you visit the port
app.listen(PORT, () => {
  console.log(`Server is currently 🏃‍♂️ on port ${PORT}`);
});
