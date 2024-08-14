
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

exports.book_detail = asyncHandler( async(req, res, next) => {
    console.log("book detail")

    const bookID = req.params.id

    const queryOne =   `SELECT title, family_name || ', ' || first_name AS full_name, summary, isbn, 
                        ARRAY_AGG (name) genres
                        FROM books
                        INNER JOIN authors
                        ON authors.author_id = books.author_id
                        INNER JOIN books_genre
                        ON books.book_id = books_genre.book_id
                        INNER JOIN genres
                        ON genres.genre_id = books_genre.genre_id
                        WHERE books.book_id = $1
                        GROUP BY title, family_name, first_name, summary, isbn;`

    const queryTwo =   `SELECT bk_instance_id, imprint, status, due_back FROM book_instances
                        INNER JOIN books
                        ON books.book_id = book_instances.book_id
                        WHERE books.book_id = $1;`
                        
    const values = [ bookID ]

    const [ book, bookInstances ] = await Promise.all([
        await pool.query(queryOne, values),
        await pool.query(queryTwo, values)
    ])

    res.render("book_detail", {
        title: book.rows[0].title,
        book: book.rows[0],
        book_instances: bookInstances.rows
    })
})