
const asyncHandler = require("express-async-handler")
const pool = require("../db/pool")

exports.index = asyncHandler( async(req, res, next) => {

    const [ authors, books, genres, bookInstances, available ] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM authors;"),
        pool.query("SELECT COUNT(*) FROM books;"),
        pool.query("SELECT COUNT(*) FROM genres;"),
        pool.query("SELECT COUNT(*) FROM book_instances;"),
        pool.query("SELECT COUNT(*) FROM book_instances WHERE status = 'Available';")
    ])

    const authorCount = authors.rows[0].count
    const bookCount = books.rows[0].count
    const genreCount = genres.rows[0].count
    const bookInstanceCount = bookInstances.rows[0].count
    const availableCopies = available.rows[0].count

    res.render("index", {
        title: "Inventory",
        author_count: authorCount,
        book_count: bookCount,
        book_instance_count: bookInstanceCount,
        genre_count: genreCount,
        available_books_count: availableCopies,
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

    const queryOne =   `SELECT title, books.book_id, genres.genre_id, summary, authors.author_id, family_name || ', ' || first_name AS full_name, isbn, 
                        ARRAY_AGG (name) genres
                        FROM books
                        INNER JOIN authors
                        ON authors.author_id = books.author_id
                        INNER JOIN books_genre
                        ON books.book_id = books_genre.book_id
                        INNER JOIN genres
                        ON genres.genre_id = books_genre.genre_id
                        WHERE books.book_id = $1
                        GROUP BY title, books.book_id, genres.genre_id, authors.author_id, family_name, first_name, summary, isbn;`

    const queryTwo =   `SELECT bk_instance_id, imprint, status, TO_CHAR(due_back, 'Mon dd, YYYY') AS due_back FROM book_instances
                        INNER JOIN books
                        ON books.book_id = book_instances.book_id
                        WHERE books.book_id = $1;`
                        
    const values = [ bookID ]

    const [ book, bookInstances ] = await Promise.all([
        await pool.query(queryOne, values),
        await pool.query(queryTwo, values)
    ])
    console.log(book.rows)
    res.render("book_detail", {
        title: book.rows[0].title,
        book: book.rows[0],
        book_instances: bookInstances.rows
    })
})

exports.book_delete = asyncHandler( async(req, res, next) => {
    console.log("book delete")

    const bookID = req.params.id

    const text =    `SELECT * FROM book_instances
                     INNER JOIN books
                     ON book_instances.book_id = books.book_id
                     WHERE books.book_id = $1;`

    const { rows } = await pool.query(text, [bookID]) // check for instances

    if (rows.length === 0) {

        const text =    `DELETE FROM books
                         WHERE book_id = 3;`

        await pool.query(text, [bookID])

        res.redirect('/books/')
    } else {
        res.redirect(`/book/bookinstances/${bookID}`)
    }
})