
const asyncHandler = require("express-async-handler")
const pool = require("../db/pool")

exports.genre_list = asyncHandler( async(req, res, next) => {
    console.log("genre list")

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

    console.log(rows)

    res.render("genre_detail", {
        title: "Genre Detail",
        genre_name: rows[0].name,
        genre_books: rows
    })
})