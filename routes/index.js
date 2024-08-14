const express = require("express")
const router = express.Router()

const book_controller = require("../controllers/bookController")

router.get('/', book_controller.index)

router.get('/books', book_controller.book_list)

router.get('/books/:id', book_controller.book_detail)

// router.get('/authors', )

// router.get('/genres',)

// router.get('/bookinstances', )


module.exports = router