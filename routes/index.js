const express = require("express")
const router = express.Router()

const book_controller = require("../controllers/bookController")
const author_controller = require("../controllers/authorController")
const genre_controller = require("../controllers/genreController")
const bkinstance_controller = require("../controllers/bookinstanceController")

router.get('/', book_controller.index)

router.get('/books', book_controller.book_list)

router.get('/books/:id', book_controller.book_detail)

router.get('/authors', author_controller.author_list)

router.get('/authors/:id', author_controller.author_detail)

router.get('/genres', genre_controller.genre_list)

router.get('/genres/:id', genre_controller.genre_detail)

router.get('/bookinstances', bkinstance_controller.bkinstance_list)

router.get('/bookinstances/:id', bkinstance_controller.bkinstance_detail)

router.get('/bookinstances/:id/delete', bkinstance_controller.bkinstance_delete)

router.get('/books/:id/delete', book_controller.book_delete)

router.get('/book/bookinstances/:id', bkinstance_controller.auth_bkinstance_list)


router.get('/authors/:id/delete', author_controller.author_delete)

module.exports = router