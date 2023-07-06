const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const forgotPassword = require('../models/forgotPassword')

exports.forgotPassword = async (req,  res, next) => {
  const email = req.body.email;
  console.log(email);
  const { v4: uuidv4 } = require('uuid');
  const uuid = uuidv4();
  const user = await User.findOne({where: {email: email}})
  //console.log(user);
  await forgotPassword.create({id: uuid, isActive: true, userId: user.id})
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.NODEMAILER_MAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });
      
    main().catch(console.error);
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Google CEO 👻" <abc@email.com>', // sender address
          to: email, // list of receivers
          subject: "Hello ✔", // Subject line
          text: `Head to this link`, // plain text body
          html: "<p><a href=`http://localhost:3000/password/resetPassword/${uuid}`</a> CLick here to reset your password<p>"
        });
      
        console.log("Message sent: %s", info.messageId);
        
        res.json({uuid: uuid});
}

}

exports.getResetPassword = async (req, res, next) => {
  const uuid = req.params.uuid;
  const forgotReq = await forgotPassword.findByPk(uuid)
  if(forgotReq && forgotReq.isActive){
    res.sendFile(__dirname + "/resetForm.html")
    // res.status(201).json({message: 'valid request'});
  }
}

exports.postResetPassword = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({where: {email:email}})
  bcrypt.hash(password, 10, async(err, hash) => {
    console.log(err)
    await User.update(
      {password: hash},
      {where:{ 
        id: user.id
      }}
      );
  })
  await forgotPassword.update(
    {isActive: false},
    {where: {
      userId:user.id
    }}
  )
  res.json({message: 'password changed successfully'});
  // const uuid = req.params.uuid;
  // const req = await forgotPassword.findByPk(uuid)
  // const user = await User.findByPk(req.userId);
}



 