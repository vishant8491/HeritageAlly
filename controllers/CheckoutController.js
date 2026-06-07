const Checkout = require("../models/Checkout")
const mailer = require("../middleware/mailer")

const Razorpay = require("razorpay")

//Payment API
async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR"
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}


async function verifyOrder(req, res) {
    try {
        var check = await Checkout.findOne({ _id: req.body.checkid })
        check.rppid = req.body.razorpay_payment_id
        check.paymentStatus = "Done"
        check.paymentMode = "Net Banking"
        await check.save()
        res.status(200).send({ result: "Done", message: "Payment SuccessFull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}


async function createRecord(req, res) {
    try {
        let data = new Checkout(req.body) 
        await data.save()
            let finalData = await Checkout.findOne({ _id: data._id })
                .populate("user",["name","userid"])
                .populate({
                    path: "products.product",
                    select: "name brand finalPrice stockQuantity",
                    populate: {
                        path: "brand",
                        select: "_id name"
                    },
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
                })

            let products = finalData.products?.map((item)=>{
                return `
                <tr>
                    <td style="border-bottom:1px solid #eee;">${item.product?.name}</td>
                    <td style="border-bottom:1px solid #eee;padding-left:80px;">${item.qty}</td>
                    <td style="border-bottom:1px solid #eee;">&#8377;${item.product?.finalPrice}</td>
                </tr>
                `
            }).join("")
            
            mailer.sendMail({
                            from:process.env.MAILSENDER,
                            to:data.deliveryAddress?.email,
                            subject: `Order Has Been Placed successfully : Team  ${process.env.SITE_NAME}`,
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

                Hello ${data.deliveryAddress?.name},

              </p>

              <!-- Message -->
              <p style="margin:0 0 25px 0;
                        font-size:18px;
                        line-height:30px;
                        color:#444444;">

                🎉 Thank you for your order! Your order has been successfully placed.

              </p>

              <!-- Order Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#f3f4f6;
                            border-radius:4px;
                            margin-bottom:30px;">

                <tr>
                  <td style="padding:22px;">

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Order ID:</strong> ${data._id}

                    </p>

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Order Date:</strong> ${new Date(data.createdAt).toLocaleString()}

                    </p>

                    <p style="margin:0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Payment Method:</strong> ${data.paymentMode}

                    </p>

                  </td>
                </tr>

              </table>

              <!-- Product Table -->
              <table width="100%" cellpadding="10" cellspacing="0" border="0"
                     style="border-collapse:collapse;
                            margin-bottom:25px;">

                <!-- Table Header -->
                <tr style="background-color:#f3f4f6;">

                  <th align="left"
                      style="font-size:15px;
                             color:#444444;
                             border-bottom:1px solid #dddddd;">

                    Item

                  </th>

                  <th align="center"
                      style="font-size:15px;
                             color:#444444;
                             border-bottom:1px solid #dddddd;">

                    Qty

                  </th>

                  <th align="right"
                      style="font-size:15px;
                             color:#444444;
                             border-bottom:1px solid #dddddd;">

                    Price

                  </th>

                </tr>

                ${products}

                <!-- Product Row -->

              </table>

              <!-- Total Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="margin-bottom:35px;">

                <tr>
                  <td align="right">

                    <p style="margin:0 0 10px 0;
                              font-size:17px;
                              color:#444444;">

                      <strong>Subtotal:</strong> &#8377;${data.subtotal}

                    </p>

                    <p style="margin:0 0 10px 0;
                              font-size:17px;
                              color:#444444;">

                      <strong>Shipping:</strong> &#8377;${data.shipping}

                    </p>

                    <p style="margin:0;
                              font-size:22px;
                              color:#222222;">

                      <strong>Total:</strong> &#8377;${data.total}

                    </p>

                  </td>
                </tr>

              </table>

              <!-- Shipping Address -->
              <h3 style="margin:0 0 12px 0;
                         font-size:22px;
                         color:#444444;">

                Shipping Address:

              </h3>

              <p style="margin:0 0 35px 0;
                        font-size:16px;
                        line-height:28px;
                        color:#555555;">

                ${data.deliveryAddress?.address}

              </p>

              <p style="margin:0 0 35px 0;
                        font-size:16px;
                        line-height:28px;
                        color:#555555;">

                ${data.deliveryAddress?.pin},
                ${data.deliveryAddress?.city},
                ${data.deliveryAddress?.state}

              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0"
                     align="center">

                <tr>
                  <td align="center"
                      style="background-color:#4a90e2;
                             border-radius:4px;">

                    <a href="${data.SITE_URL}/profile"
                       style="display:inline-block;
                              padding:14px 34px;
                              color:#ffffff;
                              font-size:16px;
                              font-weight:bold;
                              text-decoration:none;
                              border-radius:4px;">

                      Track Your Order

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
                        font-size:16px;
                        color:#6b7280;">

                If you have any qusetion, free feel to contact our support team.

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
                data: finalData
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
        let data = await Checkout.find().sort({ _id: -1 })
        .populate("user",["name","userid"])
                .populate({
                    path: "products.product",
                    select: "name brand finalPrice stockQuantity pic",
                    populate: {
                        path: "brand",
                        select: "_id name"
                    },
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
                })
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

async function getUserRecord(req, res) {
    try {
        let data = await Checkout.find({ user: req.params._id }).sort({ _id: -1 })
        .populate("user",["name","userid"])
                .populate({
                    path: "products.product",
                    select: "name brand finalPrice stockQuantity pic",
                    populate: {
                        path: "brand",
                        select: "_id name"
                    },
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
                })
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
        let data = await Checkout.findOne({ _id: req.params._id })
        .populate("user",["name","userid"])
                .populate({
                    path: "products.product",
                    select: "name brand finalPrice stockQuantity pic",
                    populate: {
                        path: "brand",
                        select: "_id name"
                    },
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
                })
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
        let data = await Checkout.findOne({ _id: req.params._id })
        .populate("user",["name","userid"])
                .populate({
                    path: "products.product",
                    select: "name brand finalPrice stockQuantity pic",
                    populate: {
                        path: "brand",
                        select: "_id name"
                    },
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
                })
        if(data){
            data.orderStatus = req.body.orderStatus ?? data.orderStatus
            data.paymentMode = req.body.paymentMode ?? data.paymentMode
            data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus
            data.rppid = req.body.rppid ?? data.rppid
            await data.save()

             mailer.sendMail({
                            from:process.env.MAILSENDER,
                            to:data.deliveryAddress?.email,
                            subject: `Order Status is Updated : Team  ${process.env.SITE_NAME}`,
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

                Hello ${data.deliveryAddress?.name},

              </p>

              <!-- Message -->
              <p style="margin:0 0 25px 0;
                        font-size:18px;
                        line-height:30px;
                        color:#444444;">

                📦 Your order status has been updated successfully.

              </p>

              <!-- Status Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#f3f4f6;
                            border-radius:4px;
                            margin-bottom:30px;">

                <tr>
                  <td style="padding:22px;">

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Order ID:</strong> ${data._id}

                    </p>

                    <p style="margin:0 0 14px 0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Current Status:</strong>

                      <span style="background-color:#4a90e2;
                                   color:#ffffff;
                                   padding:6px 12px;
                                   border-radius:4px;
                                   font-size:14px;
                                   font-weight:bold;">

                        ${data.orderStatus}

                      </span>

                    </p>

                    <p style="margin:0;
                              font-size:16px;
                              color:#444444;">

                      <strong>Updated On:</strong> ${new Date(data.updatedAt).toLocaleString()}

                    </p>

                  </td>
                </tr>

              </table>

              <!-- Extra Message -->
              <p style="margin:0 0 30px 0;
                        font-size:16px;
                        line-height:28px;
                        color:#555555;">

                Order is Reached at the Final Delivery Station

              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0"
                     align="center">

                <tr>
                  <td align="center"
                      style="background-color:#4a90e2;
                             border-radius:4px;">

                    <a href="${process.env.SITE_URL}/profile"
                       style="display:inline-block;
                              padding:14px 34px;
                              color:#ffffff;
                              font-size:16px;
                              font-weight:bold;
                              text-decoration:none;
                              border-radius:4px;">

                      View Order Details

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

                Address: ${process.env.ADDRESS}

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
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key=> [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: Object.keys(errorMessage).length!==0?errorMessage:"Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
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
    getUserRecord: getUserRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    order: order, 
    verifyOrder: verifyOrder
}