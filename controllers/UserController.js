const User = require("../models/User")
const passwordValidator = require('password-validator')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const mailer = require("../middleware/mailer")

// Create a schema
const schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have at least 1 uppercase letters
    .has().lowercase()                              // Must have at least 1 lowercase letters
    .has().digits(1)                                // Must have at least 1 digits
    .has().symbols(1)                               // Must have at least 1 dpecial character
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


async function createRecord(req, res) {
    if(schema.validate(req.body.password)){
        bcrypt.hash(req.body.password,12, async(error,hash)=>{
            if(error){
                res.status(500).send({
                    status:"Fail",
                    reason: "Internal Server Error While Creating Hash Password"
                })
            }
            else {
        try {
        let data = new User(req.body) 
        data.role = "Buyer"
        data.password = hash
        await data.save()
         mailer.sendMail({
                from:process.env.MAILSENDER,
                to:data.email,
                subject: `Welcome to  ${process.env.SITE_NAME}`,
                html:  
    `
     <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:10px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#111827;padding:30px;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:bold;">
                ${process.env.SITE_NAME}
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:40px 30px;color:#333333;">

              <h2 style="margin-top:0;font-size:26px;color:#111827;">
                Welcome to ${process.env.SITE_NAME} 🎉
              </h2>

              <p style="font-size:16px;line-height:28px;margin:20px 0;">
                Hello <strong>${data.username}</strong>,
              </p>

              <p style="font-size:16px;line-height:28px;margin:20px 0;color:#4b5563;">
                Your account has been successfully created. We're excited to have you as part of our platform.
              </p>

              <!-- Success Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0;">
                <tr>
                  <td align="center">

                    <div style="background-color:#ecfdf5;border:1px solid #10b981;padding:20px;border-radius:8px;display:inline-block;min-width:250px;">

                      <p style="margin:0;font-size:18px;font-weight:bold;color:#065f46;">
                        Signup Successful ✅
                      </p>

                    </div>

                  </td>
                </tr>
              </table>

              <p style="font-size:16px;line-height:28px;color:#4b5563;">
                You can now log in and start using all features available on our platform.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-top:35px;">
                <tr>
                  <td align="center" style="border-radius:6px;background-color:#111827;">
                    <a href="${process.env.SITE_URL}/login" 
                       style="display:inline-block;padding:14px 30px;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;">
                      Login Now
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;line-height:26px;color:#6b7280;margin-top:35px;">
                If you did not create this account, please contact our support team immediately.
              </p>

              <p style="font-size:16px;line-height:28px;margin-top:30px;">
                Regards,<br />
                <strong>${process.env.SITE_NAME}</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:25px 30px;text-align:center;border-top:1px solid #e5e7eb;">

              <p style="margin:5px 0;font-size:14px;color:#6b7280;">
                Email:
                <a href="mailto:${process.env.SITE_EMAIL}" style="color:#2563eb;text-decoration:none;">
                  ${process.env.SITE_EMAIL}
                </a>
              </p>

              <p style="margin:5px 0;font-size:14px;color:#6b7280;">
                Phone: ${process.env.SITE_PHONE}
              </p>

              <p style="margin:5px 0;font-size:14px;color:#6b7280;">
                Address: ${process.env.ADDRESS}
              </p>

              <p style="margin-top:15px;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} ${process.env.SITE_NAME}. All rights reserved.
              </p>

            </td>
          </tr>

        </table>
`
            }, (error) => {
                if (error)
                    console.log(error)
            })
            res.send({
                status: "Done",
                data: data
            })
    } catch (error) {
        let errorMessage = {}
        if (error.keyValue){
            error.keyValue.username?errorMessage.username = "Username Already Taken":''
            error.keyValue.email?errorMessage.email = "Email Address Already Taken":''
        }
        else
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key=> [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: Object.keys(errorMessage).length!==0?errorMessage:"Internal Server Error"
        })
    }
            }
        })
    }
    else {
        res.status(500).send({
            status:"Fail",
            reason: schema.validate(req.body.password, { details: true }).map(x => x.message.replaceAll("string","Password"))
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
        res.send({
            status:"Done",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if(data){
        res.send({
            status:"Done",
            data: data
        })
    }
    else{
        res.status(404).send({
            status:"Fail",
            reason: "Record Not Found"
        })
    }
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if(data){
            data.name = req.body.name ?? data.name
            data.username = req.body.username ?? data.username
            data.email = req.body.email ?? data.email
            data.address = req.body.address ?? data.address
            data.role = req.body.role ?? data.role
            data.status = req.body.status ?? data.status
            await data.save()
            res.send({
                status:"Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                status:"Fail",
                reason: "Record Not Found"
        })
    }
    } catch (error) {
        let errorMessage = {}
        if (error.keyValue){
            error.keyValue.username?errorMessage.username = "Username Already Taken":''
            error.keyValue.email?errorMessage.email = "Email Address Already Taken":''
        }
        else
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key=> [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: Object.keys(errorMessage).length!==0?errorMessage:"Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if(data) {
        await data.deleteOne()
    }
    res.send({
        status: "Done"
    })
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
    }
}

async function login(req, res) {
    try {
        let data = await User.findOne({ 
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if(data){
            if( await bcrypt.compare(req.body.password, data.password)) {
                jwt.sign({data},process.env.JWT_USER_KEY,{ expiresIn: "15 days"},(error,token)=>{
                    res.send({
                    status:"Done",
                    data: data,
                    token:token
                  })
                })
            }
            else {
                res.status(404).send({
                    status:"Fail",
                    reason: "Invalid Username or Password"
                })
            }
    }
    else{
        res.status(404).send({
            status:"Fail",
            reason: "Invalid Username or Password"
        })
    }
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({ 
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if(data){
            let otp = Number(Math.floor(Math.random() * 600000).toString().padEnd(6,"1"))
            data.passwordReset = {
                otp:otp,
                date:new Date()
            }
            await data.save()

            mailer.sendMail({
                from:process.env.MAILSENDER,
                to:data.email,
                subject: `OTP for Password Reset : Team ${process.env.SITE_NAME}`,
                html:  
    `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:10px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#111827;padding:30px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                ${process.env.SITE_NAME}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 30px;color:#333333;">

              <h2 style="margin-top:0;font-size:24px;color:#111827;">
                OTP Verification
              </h2>

              <p style="font-size:16px;line-height:26px;margin:20px 0;">
                Hello ${data.name},
              </p>

              <p style="font-size:16px;line-height:26px;margin:20px 0;">
                Use the OTP below to verify your email address. This OTP is valid for the next 10 minutes.
              </p>

              <!-- OTP Box -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:30px 0;">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background-color:#111827;color:#ffffff;font-size:32px;font-weight:bold;letter-spacing:8px;padding:18px 35px;border-radius:8px;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;line-height:24px;color:#555555;">
                If you did not request this OTP, please ignore this email.
              </p>

              <p style="font-size:16px;line-height:26px;margin-top:30px;">
                Regards,<br />
                <strong>${process.env.SITE_NAME}</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:25px 30px;text-align:center;border-top:1px solid #e5e7eb;">

              <p style="margin:5px 0;font-size:14px;color:#6b7280;">
                Email:
                <a href="mailto:${process.env.SITE_EMAIL}" style="color:#2563eb;text-decoration:none;">
                  ${process.env.SITE_EMAIL}
                </a>
              </p>

              <p style="margin:5px 0;font-size:14px;color:#6b7280;">
                Phone: ${process.env.SITE_PHONE}
              </p>

              <p style="margin:5px 0;font-size:14px;color:#6b7280;">
                Address: ${process.env.SITE_ADDRESS}
              </p>

              <p style="margin-top:15px;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} ${process.env.SITE_NAME}. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
`
            }, (error) => {
                if (error)
                    console.log(error)
            })
            res.send({
                result:"Done",
                message:"OTP Has Been Sent On Your Registered Email Address"
            })
    }
    else{
        res.status(404).send({
            status:"Fail",
            reason: "User Not Found"
        })
    }
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({ 
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if(data){
            if(data.passwordReset.otp == req.body.otp){
                if(((new Date())-data.passwordReset.date)<100000) {
            res.send({
                result:"Done",
                message:"OTP Has Been Matched!!!!"
            })
        } 
        else {
            res.status(404).send({
                status:"Fail",
                reason: "OTP Has Been Expired, Please try Again"
            })
        }
        }
        else {
            res.status(404).send({
                status:"Fail",
                reason: "Invalid OTP"
            })
        }
    }
    else{
        res.status(404).send({
            status:"Fail",
            reason: "Unauthorized Activity"
        })
    }
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({ 
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if(data){
        if(schema.validate(req.body.password)){
        bcrypt.hash(req.body.password,12, async(error,hash)=>{
            if(error){
                res.status(500).send({
                    status:"Fail",
                    reason: "Internal Server Error While Creating Hash Password"
                })
            }
            else {
        try {
        data.password = hash
        await data.save()

         mailer.sendMail({
                from:process.env.MAILSENDER,
                to:data.email,
                subject: `Password Has Been Updated successfully : Team  ${process.env.SITE_NAME}`,
                html:  
    `
    
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 0;background-color:#f3f4f6;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#ffffff;border-radius:6px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background-color:#4a90e2;padding:22px 20px;">

              <h1 style="margin:0;
                         color:#ffffff;
                         font-size:34px;
                         font-weight:bold;">

                ${process.env.SITE_NAME}

              </h1>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 30px;color:#333333;">

              <p style="font-size:18px;
                        margin-top:0;
                        margin-bottom:28px;
                        color:#444444;">

                Hello ${data.name},

              </p>

              <p style="font-size:16px;
                        line-height:28px;
                        color:#555555;
                        margin-bottom:30px;">

                This is a confirmation that your password has been successfully updated.

              </p>

              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="margin-bottom:30px;">
                <tr>
                  <td>

                    <div style="background-color:#eef4fc;
                                border-left:4px solid #4a90e2;
                                padding:18px 20px;
                                border-radius:4px;
                                color:#555555;
                                font-size:15px;
                                line-height:24px;">

                      If you made this change, no further action is required.

                    </div>

                  </td>
                </tr>
              </table>

              <p style="font-size:16px;
                        line-height:28px;
                        color:#555555;
                        margin-top:10px;">

                If you did <strong>not</strong> update your password, please secure your account immediately.

              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0"
                     style="margin-top:35px;">
                <tr>
                  <td align="center"
                      style="background-color:#4a90e2;
                             border-radius:4px;">

                    <a href="${process.env.SITE_URL}/forget-password-1"
                       style="display:inline-block;
                              padding:14px 34px;
                              font-size:16px;
                              font-weight:bold;
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:4px;">

                      Reset Password

                    </a>

                  </td>
                </tr>
              </table>

              <!-- Regards -->
              <p style="font-size:16px;
                        line-height:28px;
                        color:#555555;
                        margin-top:45px;">

                Regards,<br />
                <strong>${process.env.SITE_NAME}</strong>

              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
                style="background-color:#f9fafb;
                       padding:25px 20px;
                       border-top:1px solid #e5e7eb;">

              <p style="margin:5px 0;
                        font-size:14px;
                        color:#6b7280;">

                Email:
                <a href="mailto:${process.env.SITE_EMAIL}"
                   style="color:#4a90e2;
                          text-decoration:none;">

                  ${process.env.SITE_EMAIL}

                </a>

              </p>

              <p style="margin:5px 0;
                        font-size:14px;
                        color:#6b7280;">

                Phone: ${process.env.SITE_PHONE}

              </p>

              <p style="margin:5px 0;
                        font-size:14px;
                        color:#6b7280;">

                Address: ${process.env.SITE_ADDRESS}

              </p>

              <p style="margin-top:15px;
                        font-size:12px;
                        color:#9ca3af;">

                © ${new Date().getFullYear()} ${process.env.SITE_NAME}. All rights reserved.

              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
`
            }, (error) => {
                if (error)
                    console.log(error)
            })
            res.send({
                status: "Done",
                data: data
            })
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
        
    }
            }
        })
    }
    else {
        res.status(500).send({
            status:"Fail",
            reason: schema.validate(req.body.password, { details: true }).map(x => x.message.replaceAll("string","Password"))
        })
    }       
    }
    else{
        res.status(404).send({
            status:"Fail",
            reason: "Unauthorized Activity"
        })
    }
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    login: login,
    forgetPassword1: forgetPassword1,
    forgetPassword2: forgetPassword2,
    forgetPassword3: forgetPassword3
}