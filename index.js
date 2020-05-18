const express = require('express');
const bodyParser = require('body-parser');
const schematic=require('./user_info')
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer')

const app = express();

app.use(bodyParser.json());

var key='privatekey'

async function mailer(sent_email,link) {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  let info = await transporter.sendMail({
    from: '"Shubham Shekhar" <shubhamverify@gmail.com>',
    to: sent_email,
    subject: "Email Verifier",
    text: `please click on this link to verify ${link}`,
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

//user registration
app.post('/user',(req,res)=>{
    let senderbody={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        isVerified:false
    }
    schematic.user_register(senderbody,res)
    const token=jwt.sign({'email':req.body.email},key,{ expiresIn: 10 * 60 })
    let link='http://localhost:4000/validate/user/'+token
    mailer(req.body.email,link)
})
app.get('/validate/user/:token',(req,res)=>{
    let validating_token=req.params.token
    jwt.verify(validating_token, key, function(err, decoded) {
        schematic.user_authenticated(decoded.email)
    });
})
//user login
app.post('/user/login',(req,res)=>{
    let email=req.body.email
    let password=req.body.password
    schematic.user_login(email,password,res)
})

const port=process.env.PORT || 4000

app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})