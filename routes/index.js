const express = require("express")
const router = express.Router()

const tech_controller = require("../controllers/techController")
const framework_controller = require("../controllers/frameworkController")
const library_controller = require("../controllers/libraryController")


router.get('/', tech_controller.index)


module.exports = router