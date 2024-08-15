
const asyncHandler = require("express-async-handler")
const pool = require("../db/pool")

exports.author_list = asyncHandler( async(req, res, next) => {
    console.log("author list")

    const text =    `SELECT author_id,
                     TO_CHAR(date_of_birth, 'Mon dd, YYYY') AS dob,
                     TO_CHAR(date_of_death, 'Mon dd, YYYY') AS dod, 
                     family_name || ', ' || first_name AS full_name
                     FROM authors;`

    const { rows } = await pool.query(text)

    res.render("author_list", {
        title: "Author List",
        author_list: rows
    })
})

exports.author_detail = asyncHandler( async(req, res, next) => {
    console.log("author detail")
    const bookID = req.params.id

    const text =   `SELECT family_name || ', ' || first_name AS full_name,
                    TO_CHAR(date_of_birth, 'Mon dd, YYYY') AS dob,
                    TO_CHAR(date_of_death, 'Mon dd, YYYY') AS dod,
                    title, book_id, summary FROM authors
                    INNER JOIN books
                    ON authors.author_id = books.author_id
                    WHERE authors.author_id = $1;`
  
    const { rows } = await pool.query(text, [bookID])
    console.log(rows)
    res.render("author_detail", {
        title: "Author Detail",
        author: rows
    })
})