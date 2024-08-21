
const { body, validationResult } = require("express-validator")
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

    const queryOne = `SELECT family_name || ', ' || first_name AS full_name,
                    TO_CHAR(date_of_birth, 'Mon dd, YYYY') AS dob,
                    TO_CHAR(date_of_death, 'Mon dd, YYYY') AS dod,
                    authors.author_id FROM authors
                    WHERE authors.author_id = $1`

    const queryTwo = `SELECT title, authors.author_id, book_id, summary FROM authors
                    INNER JOIN books
                    ON authors.author_id = books.author_id
                    WHERE authors.author_id = $1;`
    
    const [ author, books ] = await Promise.all([
        await pool.query(queryOne, [bookID]),
        await pool.query(queryTwo, [bookID])
    ])
        
    console.log(author.rows)
    res.render("author_detail", {
        title: "Author Detail",
        author: author.rows[0],
        books: books.rows,
    })
})

exports.author_delete = asyncHandler( async(req, res, next) => {

    const authorID = req.params.id

    const text =    `SELECT COUNT(*) FROM authors
                     INNER JOIN books
                     ON authors.author_id = books.author_id
                     WHERE authors.author_id = $1;`

    const { rows } = await pool.query(text, [authorID])

    if (rows[0].count === "0") {
    
        const text =    `DELETE FROM authors
                         WHERE authors.author_id = $1;`

        const { rows } = await pool.query(text, [authorID])

        res.redirect(`/authors/`)
    } else {
        res.redirect(`/authors/${authorID}`)
    }
})


exports.author_create_get = asyncHandler( async(req, res, next) => {
    res.render("author_form", {
        title: "Create Author"
    }) 
})
    
exports.author_create_post = [

    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),
    body("date_of_birth", "Invalid date of birth")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    body("date_of_death", "Invalid date of death")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    asyncHandler( async(req, res, next) => {

        const errors = validationResult(req)

        const author = {
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        }

        if (errors.isEmpty()) {
            console.log("no validation issues")

            const text = `INSERT INTO authors (first_name, family_name, date_of_birth, date_of_death) VALUES ($1, $2, $3::date, $4::date);`

            const values = [author.first_name, author.family_name, author.date_of_birth, author.date_of_death]
            
            const { rows } = await pool.query(text, values)

        } else {
            res.render("author_form", {
                title: "Create Author",
                author: author,
                errors: errors.array(),
            });
        }

    })
]