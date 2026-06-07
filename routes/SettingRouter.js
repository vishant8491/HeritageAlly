const SettingRouter = require("express").Router()
const { authAdmin, authSuperAdmin, authPublic } = require("../middleware/auth")
const {
    createRecord,
    getRecord,
} = require("../controllers/SettingController")

SettingRouter.post("", authAdmin, createRecord)
SettingRouter.get("", authPublic, getRecord)

module.exports = SettingRouter
