const ContactUs = require("../models/ContactUs")
const mailer = require("../middleware/mailer")

async function createRecord(req, res) {
    try {
        let data = new ContactUs(req.body) 
        await data.save()

        mailer.sendMail({
            from:process.env.MAILSENDER,
            to:data.email,
            subject: `Your Query Has Been Received: Team  ${process.env.SITE_NAME}`,
            html:  
        `
         <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="padding:30px 0;background-color:#f3f4f6;">

    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#ffffff;border-radius:4px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background-color:#4a90e2;padding:16px;">

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
            <td style="padding:35px 28px;">

              <!-- Greeting -->
              <p style="margin:0 0 25px 0;
                        font-size:18px;
                        color:#444444;">

                Hello ${data.name},

              </p>

              <!-- Main Message -->
              <p style="margin:0 0 25px 0;
                        font-size:18px;
                        line-height:30px;
                        color:#444444;">

                📩 Thank you for contacting us. We have successfully received your query.

              </p>

              <!-- Query Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#f3f4f6;
                            border-radius:4px;
                            margin-bottom:30px;">

                <tr>
                  <td style="padding:22px;">

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Subject:</strong> ${data.subject}

                    </p>

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Submitted On:</strong> ${new Date(data.createdAt).toLocaleString()}

                    </p>

                  </td>
                </tr>

              </table>

              <!-- Info Message -->
              <p style="margin:0 0 30px 0;
                        font-size:16px;
                        line-height:28px;
                        color:#555555;">

                Our support team will review your request and get back to you as soon as possible.
                Our team usually responds within 24-48 hours.

              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0"
                     align="center">

                <tr>
                  <td align="center"
                      style="background-color:#4a90e2;
                             border-radius:4px;">

                    <a href="${process.env.SITE_URL}"
                       style="display:inline-block;
                              padding:14px 34px;
                              color:#ffffff;
                              font-size:16px;
                              font-weight:bold;
                              text-decoration:none;
                              border-radius:4px;">

                      Visit Website

                    </a>

                  </td>
                </tr>

              </table>

              <!-- Regards -->
              <p style="margin-top:45px;
                        font-size:16px;
                        line-height:28px;
                        color:#555555;">

                Regards,<br />
                <strong>${process.env.SITE_NAME}</strong>

              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
                style="padding:25px 20px;
                       background-color:#f9fafb;
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
        mailer.sendMail({
            from:process.env.MAILSENDER,
            to:process.env.MAILSENDER,
            subject: `New Contactus Query Has Been Recieved: Team  ${process.env.SITE_NAME}`,
            html:  
        `
         <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="padding:30px 0;background-color:#f3f4f6;">

    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#ffffff;border-radius:4px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background-color:#4a90e2;padding:16px;">

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
            <td style="padding:35px 28px;">

              <!-- Title -->
              <h2 style="margin:0 0 25px 0;
                         font-size:28px;
                         color:#444444;">

                📩 New Contact Us Query Received

              </h2>

              <!-- Intro -->
              <p style="margin:0 0 25px 0;
                        font-size:16px;
                        line-height:28px;
                        color:#555555;">

                A new contact query has been submitted through the website contact form.

              </p>

              <!-- Query Details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#f3f4f6;
                            border-radius:4px;
                            margin-bottom:30px;">

                <tr>
                  <td style="padding:22px;">

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Name:</strong> ${data.name}

                    </p>

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Email:</strong> ${data.email}

                    </p>

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Phone:</strong> ${data.phone}

                    </p>

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Subject:</strong> ${data.subject}

                    </p>

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Submitted On:</strong> ${new Date(data.createdAt).toLocaleString()}

                    </p>

                    <p style="margin:0;
                              font-size:16px;
                              line-height:28px;
                              color:#444444;">

                      <strong>Message:</strong><br />
                      ${data.message}

                    </p>

                  </td>
                </tr>

              </table>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0"
                     align="center">

                <tr>
                  <td align="center"
                      style="background-color:#4a90e2;
                             border-radius:4px;">

                    <a href="mailto:${data.email}"
                       style="display:inline-block;
                              padding:14px 34px;
                              color:#ffffff;
                              font-size:16px;
                              font-weight:bold;
                              text-decoration:none;
                              border-radius:4px;">

                      Reply to Customer

                    </a>

                  </td>
                </tr>

              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
                style="padding:25px 20px;
                       background-color:#f9fafb;
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
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key=> [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: Object.keys(errorMessage).length!==0?errorMessage:"Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await ContactUs.find().sort({ _id: -1 })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
        if(data){
            data.status = req.body.status ?? data.status
            await data.save()

            mailer.sendMail({
            from:process.env.MAILSENDER,
            to:data.email,
            subject: `Your Query Has Been Resolved: Team  ${process.env.SITE_NAME}`,
            html:  
        `
         <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="padding:30px 0;background-color:#f3f4f6;">

    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#ffffff;border-radius:4px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background-color:#4a90e2;padding:16px;">

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
            <td style="padding:35px 28px;">

              <!-- Greeting -->
              <p style="margin:0 0 25px 0;
                        font-size:18px;
                        color:#444444;">

                Hello ${data.name},

              </p>

              <!-- Main Message -->
              <p style="margin:0 0 25px 0;
                        font-size:18px;
                        line-height:30px;
                        color:#444444;">

                ✅ Your support query has been successfully resolved.

              </p>

              <!-- Query Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#f3f4f6;
                            border-radius:4px;
                            margin-bottom:30px;">

                <tr>
                  <td style="padding:22px;">

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Query ID:</strong> ${data._id}

                    </p>

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Subject:</strong> ${data.subject}

                    </p>

                    <p style="margin:0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Resolved On:</strong> ${new Date(data.updatedAt).toLocaleString()}

                    </p>

                  </td>
                </tr>

              </table>

              <!-- Info Message -->
              <p style="margin:0 0 30px 0;
                        font-size:16px;
                        line-height:28px;
                        color:#555555;">

                We hope your issue was resolved successfully. If you still need any assistance, feel free to contact our support team anytime.

              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0"
                     align="center">

                <tr>
                  <td align="center"
                      style="background-color:#4a90e2;
                             border-radius:4px;">

                    <a href="${process.env.SITE_URL}/contactus"
                       style="display:inline-block;
                              padding:14px 34px;
                              color:#ffffff;
                              font-size:16px;
                              font-weight:bold;
                              text-decoration:none;
                              border-radius:4px;">

                      Contact Support

                    </a>

                  </td>
                </tr>

              </table>

              <!-- Regards -->
              <p style="margin-top:45px;
                        font-size:16px;
                        line-height:28px;
                        color:#555555;">

                Regards,<br />
                <strong>${process.env.SITE_NAME}</strong>

              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
                style="padding:25px 20px;
                       background-color:#f9fafb;
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
        let errorMessage = { }
        if (error.keyValue)
            errorMessage = "ContactUs With This Question Is Already Exist"
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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


module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
}