
const asyncHandler = require("express-async-handler")
const pool = require("../db/pool")
const { body, validationResult } = require("express-validator")

exports.genre_list = asyncHandler( async(req, res, next) => {

    const text =    `SELECT * FROM genres;`
    const { rows } = await pool.query(text)

    res.render("genre_list", {
        title: "Genre List",
        genre_list: rows
    })
})

exports.genre_detail = asyncHandler(  async(req, res, next) => {
    console.log("genre details")

    const genreID = req.params.id

    const text =    `SELECT name, genres.genre_id, books.book_id, title, summary FROM genres
                     INNER JOIN books_genre
                     ON genres.genre_id = books_genre.genre_id
                     INNER JOIN books
                     ON books.book_id = books_genre.book_id
                     WHERE genres.genre_id = $1;`

    const { rows } = await pool.query(text, [genreID])

    if (rows.length === 0) {

        const text = `SELECT name FROM genres WHERE genre_id = $1;`
        const { rows } = await pool.query(text, [genreID])

        res.render("genre_detail", {
            genre_name: rows[0].name,
            genre_books: rows
        })
    } else {
        res.render("genre_detail", {
            title: "Genre Detail",
            genre_name: rows[0].name,
            genre_books: rows
        })
    }
})

exports.genre_create_get = asyncHandler( async(req, res, next) => {
    res.render("genre_form", {
        title: "Create Genre"
    })
})

exports.genre_create_post = [

    body("name", "Genre name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    asyncHandler( async(req, res, next) => {

        const newGenre = req.body.genre
    
        const text = `INSERT INTO genres (name) VALUES ($1);`
    
        const { rows } = await pool.query(text, [newGenre])
    
        res.render("genre_list", {
            title: "Genre List",
            genre_list: rows
        })
    })
]