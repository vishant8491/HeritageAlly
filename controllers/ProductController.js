const Product = require("../models/Product")
const mailer = require("../middleware/mailer")
const Newsletter = require("../models/Newsletter")

const fs = require("fs")
async function createRecord(req, res) {
    try {
        let data = new Product(req.body) 
        if(req.files)
            data.pic = Array.from(req.files).map((x)=>x.path)
            await data.save()

            let finalData = await Product.findOne({_id:data._id})
                .populate("maincategory",["name"])
                .populate("subcategory", ["name"])
                .populate("brand", ["name"])
            let emails = await Newsletter.find()

            emails.forEach(item=>{
                mailer.sendMail({
                                            from:process.env.MAILSENDER,
                                            to:item.email,
                                            subject: `Introducing Our New Product : Team  ${process.env.SITE_NAME}`,
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
                style="background-color:#4a90e2;padding:18px;">

              <h1 style="margin:0;
                         color:#ffffff;
                         font-size:34px;
                         font-weight:bold;">

                ${process.env.SITE_NAME}

              </h1>

            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td align="center"
                style="padding:40px 30px 20px 30px;">

              <h2 style="margin:0;
                         font-size:32px;
                         color:#333333;
                         line-height:42px;">

                🚀 New Products Just Arrived!

              </h2>

              <p style="margin:20px 0 0 0;
                        font-size:17px;
                        line-height:30px;
                        color:#555555;">

                Discover our latest collection and explore exciting new arrivals curated specially for you.

              </p>

            </td>
          </tr>

          <!-- Featured Products -->
          <tr>
            <td style="padding:20px 30px;">

              <!-- Product Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="border:1px solid #e5e7eb;
                            border-radius:6px;
                            margin-bottom:20px;">

                <tr>

                  <!-- Product Image -->
                  <td width="180"
                      align="center"
                      style="padding:15px;">

                    <img src="${process.env.SITE_URL}/${data.pic[0]}"
                         alt="Product"
                         width="150"
                         style="display:block;
                                border-radius:6px;
                                width:150px;
                                height:auto;" />

                  </td>

                  <!-- Product Info -->
                  <td style="padding:20px;">

                    <h3 style="margin:0 0 12px 0;
                               font-size:22px;
                               color:#333333;">

                      ${data.name}

                    </h3>

                    <p style="margin:0 0 15px 0;
                              font-size:15px;
                              line-height:26px;
                              color:#666666;">

                    ${data.description}
                    </p>

                    <p style="margin:0 0 18px 0;
                              font-size:20px;
                              color:#4a90e2;
                              font-weight:bold;">

                      &#8377;${data.finalPrice}

                    </p>

                    <a href="{{PRODUCT_URL_1}}"
                       style="display:inline-block;
                              background-color:#4a90e2;
                              color:#ffffff;
                              text-decoration:none;
                              padding:12px 22px;
                              border-radius:4px;
                              font-size:15px;
                              font-weight:bold;">

                      Shop Now

                    </a>

                  </td>

                </tr>

              </table>

            </td>
          </tr>

          <!-- CTA Section -->
          <tr>
            <td align="center"
                style="padding:20px 30px 40px 30px;">

              <p style="margin:0 0 25px 0;
                        font-size:16px;
                        line-height:28px;
                        color:#555555;">

                Explore more amazing products and exclusive deals on our website.

              </p>

              <a href="{{SHOP_URL}}"
                 style="display:inline-block;
                        background-color:#4a90e2;
                        color:#ffffff;
                        text-decoration:none;
                        padding:14px 34px;
                        border-radius:4px;
                        font-size:16px;
                        font-weight:bold;">

                Explore Collection

              </a>

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

              <p style="margin-top:12px;
                        font-size:12px;
                        color:#9ca3af;">

                You're receiving this email because you subscribed to our newsletter.

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
            })
            
            res.send({
                status: "Done",
                data: finalData
            })
    } catch (error) {
        if(req.files){
            try {
                Array.from(req.files).forEach(x => fs.unlinkSync(x.path))
            } catch (error) { }
        }
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key=> [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: Object.keys(errorMessage).length!==0?errorMessage:"Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Product.find().sort({ _id: -1 })
            .populate("maincategory",["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        
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
        let data = await Product.findOne({ _id: req.params._id })
            .populate("maincategory",["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
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
        let data = await Product.findOne({_id:req.params._id})
                .populate("maincategory",["name"])
                .populate("subcategory", ["name"])
                .populate("brand", ["name"])

        if(data){
            data.name = req.body.name ?? data.name
            data.maincategory = req.body.maincategory ?? data.maincategory
            data.subcategory = req.body.subcategory ?? data.subcategory
            data.brand = req.body.brand ?? data.brand
            data.color = req.body.color ?? data.color
            data.size = req.body.size ?? data.size
            data.basePrice = req.body.basePrice ?? data.basePrice
            data.discount = req.body.discount ?? data.discount
            data.finalPrice = req.body.finalPrice ?? data.finalPrice
            data.stock = req.body.stock ?? data.stock
            data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity
            data.description = req.body.description ?? data.description
            data.status = req.body.status ?? data.status
            await data.save()
            if (req.body.oldPics?.length === 0 && req.files?.length === 0) {
                res.send({
                    status:"Fail",
                    reason: "Please Upload Atleast One Image or Keep Atleast one Old Image"
                })
            }
            else if (req.body.oldPics && req.body.oldPics?.length !== 0 && req.files?.length === 0) {
                data.pic.forEach(x => {
                    if(!req.body.oldPics?.includes(x)) {
                        try {
                            fs.unlinkSync(x)
                        } catch (error) {}
                    }
                })
                data.pic = req.body.oldPics
                await data.save()
            }
            else if (req.files.length) {
                let oldPics = []
                if(req.body.oldPics)
                    oldPics = req.body.oldPics
                data.pic.forEach(x => {
                    if(!oldPics.includes(x)) {
                        try {
                            fs.unlinkSync(x)
                        } catch (error) { }
                    }
                })
                data.pic = oldPics.concat(Array.from(req.files).map(x=>x.path))
                await data.save()
            }
            let finalData = await Product.findOne({_id: req.params._id})
                .populate("maincategory", ["name"])
                .populate("subcategory", ["name"])
                .populate("brand", ["name"])
            res.send({
                    status:"Done",
                    data: finalData 
                })
        }
        else {
            res.status(404).send({
                status:"Fail",
                reason: "Record Not Found"
        })
    }
    } catch (error) {
        if (req.files) {
            try {
                Array.from(req.files).forEach(x => fs.unlinkSync(x.path))
            } catch (error) { }
        }
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key=> [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: errorMessage
        })
    }
}


async function deleteRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if(data) {
        try {
            data.pic.forEach(x => fs.unlinkSync(x))
        } catch (error) { }
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