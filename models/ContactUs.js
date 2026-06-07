const mongoose = require("mongoose")

const ContactUsSchema = new mongoose.Schema({
     name: {
        type: String,
        unique: true,
        required: [true, "Name Field is Mendatory"]
    },
     email: {
        type: String,
        unique: true,
        required: [true, "Email Address Field is Mendatory"]
    },
     phone: {
        type: String,
        unique: true,
        required: [true, "Phone Number Field is Mendatory"]
    },
     subject: {
        type: String,
        unique: true,
        required: [true, "Subject Field is Mendatory"]
    },
    message: {
        type: String,
        unique: true,
        required: [true, "Message Field is Mendatory"]
    },
    status: {
        type: Boolean,
        default: true
    }
},{timestamps: true})

const ContactUs = mongoose.model("ContactUs", ContactUsSchema)

module.exports = ContactUs