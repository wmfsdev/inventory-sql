const express = require("express")
const router = express.Router()

const book_controller = require("../controllers/bookController")
const author_controller = require("../controllers/authorController")

router.get('/', book_controller.index)

router.get('/books', book_controller.book_list)

router.get('/books/:id', book_controller.book_detail)

router.get('/authors', author_controller.author_list)

// router.get('/genres',)

// router.get('/bookinstances', )


module.exports = router