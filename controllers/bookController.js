
const asyncHandler = require("express-async-handler")
const pool = require("../db/pool")

exports.index = asyncHandler( async(req, res, next) => {

    const [ authors, books, genres, bookInstances ] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM authors;"),
        pool.query("SELECT COUNT(*) FROM books;"),
        pool.query("SELECT COUNT(*) FROM genres;"),
        pool.query("SELECT COUNT(*) FROM book_instances;"),
    ])

    const authorCount = authors.rows[0].count
    const bookCount = books.rows[0].count
    const genreCount = genres.rows[0].count
    const bookInstanceCount = bookInstances.rows[0].count

    res.render("index", {
        title: "Inventory",
        author_count: authorCount,
        book_count: bookCount,
        book_instance_count: bookInstanceCount,
        genre_count: genreCount,
    })
})

exports.book_list = asyncHandler( async(req, res, next) => {

    const text = "SELECT book_id, first_name, family_name, title FROM authors INNER JOIN books ON authors.author_id = books.author_id"
    const { rows } = await pool.query(text)

    res.render("book_list", {
        title: "Book List",
        book_list: rows,
    })
})