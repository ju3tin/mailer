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
    {if (req.body.buildersname.length < 1){req.body.buildersname1 = ''}else{req.body.buildersname1 = '<span><h3>Builders Name</h3></span>'}};
    {if (req.body.buildersname.length < 1){req.body.buildersname2 = ''}else{req.body.buildersname2 = `<span>`+req.body.buildersname+`</span>`}};
    {if (req.body.dontwantstatement.length < 1){req.body.dontwantstatement1 = ''}else{req.body.dontwantstatement1 = '<span><h3>Anything You Dont Want In Your Dream Kitchen.</h3></span>'}};
    {if (req.body.dontwantstatement.length < 1){req.body.dontwantstatement2 = ''}else{req.body.dontwantstatement2 = `<span>`+req.body.dontwantstatement+`</span>`}};
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

    {if(req.body.fridges === "Fridge Required"){req.body.fridges1 = "<span>&#10003;</span>"}else{req.body.fridges1 = "<span>&#9744;</span>"}};
    {if(req.body.freezers === "Freezer Required"){req.body.freezers1 = "<span>&#10003;</span>"}else{req.body.freezers1 = "<span>&#9744;</span>"}};
    {if(req.body.ovens === "Oven Required"){req.body.ovens1 = "<span>&#10003;</span>"}else{req.body.ovens1 = "<span>&#9744;</span>"}};
    {if(req.body.hobs === "Hob Required"){req.body.hobs1 = "<span>&#10003;</span>"}else{req.body.hobs1 = "<span>&#9744;</span>"}};
    {if(req.body.microwaves === "Microwave Required"){req.body.microwaves1 = "<span>&#10003;</span>"}else{req.body.microwaves1 = "<span>&#9744;</span>"}};
    {if(req.body.extractors === "Extractor Required"){req.body.extractors1 = "<span>&#10003;</span>"}else{req.body.extractors1 = "<span>&#9744;</span>"}};
    {if(req.body.sinks === "Sinks Required"){req.body.sinks1 = "<span>&#10003;</span>"}else{req.body.sinks1 = "<span>&#9744;</span>"}};
    {if(req.body.washingmachine === "Washing Machine Required"){req.body.washingmachine1 = "<span>&#10003;</span>"}else{req.body.washingmachine1 = "<span>&#9744;</span>"}};
    {if(req.body.dryer === "Dryer Required"){req.body.dryer1 = "<span>&#10003;</span>"}else{req.body.dryer1 = "<span>&#9744;</span>"}};
    {if(req.body.winecooler === "Wine Cooler Required"){req.body.winecooler1 = "<span>&#10003;</span>"}else{req.body.winecooler1 = "<span>&#9744;</span>"}};

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
      html: `<center>
      
      

  

    <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_logoBlock_1" style="background-color: #000000">
    <tbody><tr><td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
    <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="9" style="border-collapse: separate; width: 100%; mso-cellspacing: 9px; border-spacing: 9px; max-width: 570px; -mru-width: 0px" width="570" class="vb-row">
      
      <tbody><tr>
    <td align="center" valign="top" style="font-size: 0"><div style="vertical-align: top; width: 100%; max-width: 184px; -mru-width: 0px"><!--
      -->
      
      
      <table role="presentation" class="vb-content" border="0" cellspacing="9" cellpadding="0" width="184" style="border-collapse: separate; width: 100%; mso-cellspacing: 9px; border-spacing: 9px">
        
        <tbody><tr><td width="100%" valign="top" align="center" class="links-color"><!--[if (lte ie 8)]><div style="display: inline-block; width: 166px; -mru-width: 0px"><![endif]--><img border="0" hspace="0" align="center" vspace="0" width="166" style="border: 0px; display: block; vertical-align: top; height: auto; margin: 0 auto; color: #f3f3f3; font-size: 18px; font-family: Arial, Helvetica, sans-serif; width: 100%; max-width: 166px; height: auto;" src="https://mosaico.io/srv/f-4228j1i/img?src=https%3A%2F%2Fmosaico.io%2Ffiles%2F4228j1i%2Ficon-192.png&amp;method=resize&amp;params=166%2Cnull"><!--[if (lte ie 8)]></div><![endif]--></td></tr>
      
      </tbody></table></div></td>
  </tr>
    
    </tbody></table></div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
    
  </td></tr>
  </tbody>

</table>
  
  
  <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_titleBlock_2" style="background-color: #000000">
    <tbody><tr><td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
    <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" width="570" class="vb-row" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 0px; border-spacing: 0px; max-width: 570px; -mru-width: 0px">
      
      <tbody><tr>
    <td align="center" valign="top" style="font-size: 0; padding: 0 9px"><div style="vertical-align: top; width: 100%; max-width: 552px; -mru-width: 0px"><!--
      --><table role="presentation" class="vb-content" border="0" cellspacing="9" cellpadding="0" style="border-collapse: separate; width: 100%; mso-cellspacing: 9px; border-spacing: 9px" width="552">
        
        <tbody><tr>
    <td width="100%" valign="top" align="center" style="font-weight: normal; color: #3f3f3f; font-size: 22px; font-family: Arial, Helvetica, sans-serif; text-align: center"><span style="font-weight: normal">Your Quote Reminder</span></td>
  </tr>
      
      </tbody></table></div></td>
  </tr>
    
    </tbody></table></div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
  </td></tr>
  </tbody></table>
  
  
  <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_textBlock_1" style="background-color: #000000">
    <tbody><tr><td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
    <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="18" bgcolor="#ffffff" width="570" class="vb-container" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 18px; border-spacing: 18px; max-width: 570px; -mru-width: 0px">
      
      <tbody><tr><td class="long-text links-color" width="100%" valign="top" align="left" style="font-weight: normal; color: #3f3f3f; font-size: 13px; font-family: Arial, Helvetica, sans-serif; text-align: left; line-height: normal"><p style="margin: 1em 0px; margin-top: 0px;">Dear `+req.body.fullname+`,</p>
<p style="margin: 1em 0px; margin-bottom: 0px;">We wanted to let you know we got your quote. Below is a list of all the options you asked for.</p></td></tr>
    
    </tbody></table></div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
  </td></tr>
  </tbody></table>
  
<!-- Working tag -->
  <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_textBlock_1" style="background-color: #000000">
    <tbody><tr><td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
    <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="18" bgcolor="#ffffff" width="570" class="vb-container" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 18px; border-spacing: 18px; max-width: 570px; -mru-width: 0px">
      
      <tbody><tr><td class="long-text links-color" width="100%" valign="top" align="left" style="font-weight: normal; color: #3f3f3f; font-size: 13px; font-family: Arial, Helvetica, sans-serif; text-align: left; line-height: normal">


<p style="margin: 1em 0px; margin-bottom: 0px;">

`+req.body.buildersname1+`
`+req.body.buildersname2+`
  <span><h3>Parking</h3></span>
  <span>`+req.body.parking+`</span>
  <span><h3>Project Type</h3></span>
  <span>`+req.body.projecttype+`</span>
  <span><h3>Kitchen Style</h3></span>
  <span>`+req.body.kitchenstyle+`</span>
  <span><h3>Worktop Style</h3></span>
  <span>`+req.body.worktopstyle+`</span>
  <span><h3>Fitters Required</h3></span>
  <span>`+req.body.fittersrequired+`</span>
  <span><h3>Price Range</h3></span>
  <span>`+req.body.pricerange+`</span>

</p></td></tr>
    
    </tbody></table></div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
  </td></tr>
  </tbody></table>

  <!-- Working tag end-->


    
<!-- Working tag -->
<table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_textBlock_1" style="background-color: #000000">
  <tbody><tr><td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
  <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
  --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="18" bgcolor="#ffffff" width="570" class="vb-container" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 18px; border-spacing: 18px; max-width: 570px; -mru-width: 0px">
    
    <tbody><tr><td class="long-text links-color" width="100%" valign="top" align="left" style="font-weight: normal; color: #3f3f3f; font-size: 13px; font-family: Arial, Helvetica, sans-serif; text-align: left; line-height: normal">


<p style="margin: 1em 0px; margin-bottom: 0px;">
<h3>Appliances Required</h3>
<table style="border: 1px solid black; text-align: center; background-color: white; width: 100%">   

<tr>
  <td>Fridges</td>
  <td>Freezers</td>
  <td>Ovens</td>
  <td>Hobs</td>
  <td>Microwaves</td>
</tr>
<tr>
  <td><span>`+req.body.fridges1+`</span></td>
  <td><span>`+req.body.freezers1+`</span></td>
  <td><span>`+req.body.ovens1+`</span></td>
  <td><span>`+req.body.hobs1+`</span></td>
  <td><span>`+req.body.microwaves1+`</span></td>
</tr>
 <tr>
  <td>Extractors</td>
  <td>Sinks</td>
  <td>Washing Machine</td>
  <td>Dryer</td>
  <td>Wine Cooler</td>
</tr>
<tr>
  <td><span>`+req.body.extractors1+`</span></td>
  <td><span>`+req.body.sinks1+`</span></td>
  <td><span>`+req.body.washingmachine1+`</span></td>
  <td><span>`+req.body.dryer1+`</span></td>
  <td><span>`+req.body.winecooler1+`</span></td>
</tr>
</table>

</p></td></tr>
  
  </tbody></table></div><!--
--><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
</td></tr>
</tbody></table>

<!-- Working tag end-->


<!-- Working tag -->
  <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_textBlock_1" style="background-color: #000000">
    <tbody><tr><td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
    <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="18" bgcolor="#ffffff" width="570" class="vb-container" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 18px; border-spacing: 18px; max-width: 570px; -mru-width: 0px">
      
      <tbody><tr><td class="long-text links-color" width="100%" valign="top" align="left" style="font-weight: normal; color: #3f3f3f; font-size: 13px; font-family: Arial, Helvetica, sans-serif; text-align: left; line-height: normal">


<p style="margin: 1em 0px; margin-bottom: 0px;">

<span><h3>Kitchen Colour</h3></span>
  <span>`+req.body.kitchencolour+`</span>
  <span><h3>Time Scale</h3></span>
  <span>`+req.body.timescale+`</span>
  `+req.body.dontwantstatement1+`
  `+req.body.dontwantstatement2+`

</p></td></tr>
    
    </tbody></table></div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
  </td></tr>
  </tbody></table>

  <!-- Working tag end-->

  
  <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_textBlock_3" style="background-color: #000000">
    <tbody><tr><td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
    <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="18" bgcolor="#ffffff" width="570" class="vb-container" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 18px; border-spacing: 18px; max-width: 570px; -mru-width: 0px">
      
      <tbody><tr><td class="long-text links-color" width="100%" valign="top" align="left" style="font-weight: normal; color: #3f3f3f; font-size: 13px; font-family: Arial, Helvetica, sans-serif; text-align: left; line-height: normal"><p style="margin: 1em 0px; margin-bottom: 0px; margin-top: 0px;">Thank you for completing this form. One of the team will be in touch shortly to discuss your upcoming project!&nbsp;</p></td></tr>
    
    </tbody></table></div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
  </td></tr>
  </tbody></table><table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_textBlock_2" style="background-color: #000000">
    <tbody><tr><td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
    <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="18" bgcolor="#ffffff" width="570" class="vb-container" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 18px; border-spacing: 18px; max-width: 570px; -mru-width: 0px">
      
      <tbody><tr><td class="long-text links-color" width="100%" valign="top" align="left" style="font-weight: normal; color: #3f3f3f; font-size: 13px; font-family: Arial, Helvetica, sans-serif; text-align: left; line-height: normal"><p style="margin: 1em 0px; margin-top: 0px;">&nbsp;To aid in transparency we have sent some information about who we are, our terms and conditions alongside some pre-fitting requirements.”</p>
<p style="margin: 1em 0px; margin-bottom: 0px; text-align: center;">Click the button below to Download our PDF.</p></td></tr>
    
    </tbody></table></div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
  </td></tr>
  </tbody></table><table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_buttonBlock_1" style="background-color: #000000">
    <tbody><tr><td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
    <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="18" bgcolor="#ffffff" width="570" class="vb-container" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 18px; border-spacing: 18px; max-width: 570px; -mru-width: 0px">
      
      <tbody><tr>
    <td valign="top" align="center"><table role="presentation" cellpadding="12" border="0" align="center" cellspacing="0" style="border-spacing: 0; mso-padding-alt: 12px 12px 12px 12px"><tbody><tr>
      <td width="auto" valign="middle" align="center" bgcolor="#0c0c0c" style="text-align: center; font-weight: normal; padding: 12px; padding-left: 14px; padding-right: 14px; background-color: #0c0c0c; color: #ffc000; font-size: 20px; font-family: Arial, Helvetica, sans-serif; border-radius: 15px"><a style="text-decoration: none; font-weight: normal; color: #ffc000; font-size: 20px; font-family: Arial, Helvetica, sans-serif" target="_new" href="https://fandlkitchens.co.uk/FLassets/pdf/covidsafetypolicy.pdf">Download</a></td>
    </tr></tbody></table></td>
  </tr>
    
    </tbody></table></div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
  </td></tr>
  </tbody></table>
  
  <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_titleBlock_1" style="background-color: #000000">
    <tbody>
        <tr>
            <td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
    <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" width="570" class="vb-row" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 0px; border-spacing: 0px; max-width: 570px; -mru-width: 0px">
      
      <tbody>
        <tr>
    <td align="center" valign="top" style="font-size: 0; padding: 0 9px"><div style="vertical-align: top; width: 100%; max-width: 552px; -mru-width: 0px"><!--
      --><table role="presentation" class="vb-content" border="0" cellspacing="9" cellpadding="0" style="border-collapse: separate; width: 100%; mso-cellspacing: 9px; border-spacing: 9px" width="552">
        
        <tbody>
            <tr>
    <td width="100%" valign="top" align="center" style="font-weight: normal; color: #3f3f3f; font-size: 22px; font-family: Arial, Helvetica, sans-serif; text-align: center">
        <span style="font-weight: normal">TURNING YOUR KITCHEN DREAMS INTO REALITY</span>
    </td>
  </tr>
      
      </tbody>
    </table>
</div>
</td>
  </tr>
    
    </tbody></table></div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
  </td></tr>
  </tbody></table>
  <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#000000" id="ko_imageBlock_1" style="background-color: #000000">
    <tbody>
        <tr>
            <td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
    
    <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px">
        <table role="presentation" border="0" cellpadding="0" cellspacing="18" bgcolor="#ffffff" width="570" class="vb-container" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 18px; border-spacing: 18px; max-width: 570px; -mru-width: 0px">
      
      <tbody>
        <tr>
            <td width="100%" valign="top" align="center" class="links-color"><!--[if (lte ie 8)]><div style="display: inline-block; width: 534px; -mru-width: 0px"><![endif]-->
                <img border="0" hspace="0" align="center" vspace="0" width="534" style="border: 0px; display: block; vertical-align: top; height: auto; margin: 0 auto; color: #3f3f3f; font-size: 13px; font-family: Arial, Helvetica, sans-serif; width: 100%; max-width: 534px; height: auto;" src="https://mosaico.io/srv/f-4228j1i/img?src=https%3A%2F%2Fmosaico.io%2Ffiles%2F4228j1i%2F2back.png&amp;method=resize&amp;params=534%2Cnull"><!--[if (lte ie 8)]></div><![endif]-->
            </td>
        </tr>
    
    </tbody>
</table>
</div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
  </td></tr>
  </tbody></table>


  <!-- footerBlock -->
  <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#3f3f3f" id="" style="background-color: #3f3f3f">
    <tbody><tr><td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
  <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]--><!--
    --><div style="margin: 0 auto; max-width: 570px; -mru-width: 0px"><table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%; mso-cellspacing: 0px; border-spacing: 0px; max-width: 570px; -mru-width: 0px" width="570" class="vb-row">
      
    <tbody><tr>
    <td align="center" valign="top" style="font-size: 0; padding: 0 9px"><div style="vertical-align: top; width: 100%; max-width: 552px; -mru-width: 0px"><!--
      --><table role="presentation" class="vb-content" border="0" cellspacing="9" cellpadding="0" style="border-collapse: separate; width: 100%; mso-cellspacing: 9px; border-spacing: 9px" width="552">
        
      <tbody>
      <tr><td class="long-text links-color" width="100%" valign="top" align="center" style="font-weight: normal; color: #919191; font-size: 13px; font-family: Arial, Helvetica, sans-serif; text-align: center"><p style="margin: 1em 0px; margin-bottom: 0px; margin-top: 0px;"><a style="a:link {color: green; background-color: transparent; text-decoration: none;} a:visited { color: pink; background-color: transparent; text-decoration: none;} a:hover {color: red; background-color: transparent; text-decoration: underline;}a:active {color: yellow; background-color: transparent;text-decoration: underline;}" href="https://www.fandlkitchens.co.uk/">F And L Kitchens</a></p></td></tr>
      <tr style="text-align: center"><td width="100%" valign="top" align="center" class="links-color" style="text-align: center"><!--[if (lte ie 8)]><div style="display: inline-block; width: 170px; -mru-width: 0px"><![endif]--></div><![endif]--></td></tr>
    
      </tbody></table></div></td>
  </tr>
  
    </tbody></table></div><!--
  --><!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
</td></tr>
  </tbody></table>
  <!-- /footerBlock -->
  
<!--[if !(gte mso 16)]-->
      
      </center>`
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
