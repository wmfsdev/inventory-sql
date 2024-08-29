
const asyncHandler = require("express-async-handler")
const pool = require("../db/pool")
const { body, validationResult } = require("express-validator")

exports.bkinstance_list = asyncHandler( async(req, res, next) => {

    const text =    `SELECT imprint, TO_CHAR(due_back, 'Mon, dd, YYYY') AS due_back, status, title, bk_instance_id FROM book_instances
                     INNER JOIN books
                     ON book_instances.book_id = books.book_id;`

    const { rows } = await pool.query(text)

    res.render("bkinstance_list", {
        title: "Book Instances",
        bkinstance_list: rows,
    })
})

exports.bkinstance_detail = asyncHandler( async(req, res, next) => {

    const bkinstanceID = req.params.id
    const text =    `SELECT bk_instance_id, books.book_id, title, imprint, status, TO_CHAR(due_back, 'Mon, dd, YYYY') AS due_back
                     FROM book_instances
                     INNER JOIN books
                     ON book_instances.book_id = books.book_id
                     WHERE bk_instance_id = $1;`
    const { rows } = await pool.query(text, [bkinstanceID])
    console.log(rows[0])
    res.render("bkinstance_detail", {
        bkinstance: rows[0]
    })
})

exports.bkinstance_delete = asyncHandler( async(req, res, next) => {

    const bkinstanceID = req.params.id
    const text =    `DELETE FROM book_instances
                     WHERE bk_instance_id = $1
                     RETURNING *;`
    const { rows } = await pool.query(text, [bkinstanceID])
    
    res.redirect('/bookinstances/')
})


exports.auth_bkinstance_list = asyncHandler( async(req, res, next) => {

    const bkinstanceID = req.params.id
    const text =    `SELECT imprint, TO_CHAR(due_back, 'Mon, dd, YYYY') AS due_back, status, title, bk_instance_id FROM book_instances
                     INNER JOIN books
                     ON books.book_id = book_instances.book_id
                     WHERE books.book_id = $1;`
    const { rows } = await pool.query(text, [bkinstanceID])

    res.render("bkinstance_list", {
        title: "Book Instances",
        bkinstance_list: rows
    })
})

exports.bkinstance_create_get = asyncHandler( async( req, res, next) => {

    const text = `SELECT title, book_id FROM books;`

    const { rows } = await pool.query(text)

    res.render("bookinstance_form", {
        title: "Create Book Instance",
        book_list: rows
    })
})

exports.bkinstance_create_post = [

    body("book", "Book must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("imprint", "Author must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("due_back", "Summary must not be empty.")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    body("status", "Status must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler( async( req, res, next) => {

        const errors = validationResult(req)

        const bkinstance = {
            bookid: req.body.book,
            imprint: req.body.imprint,
            dueBack: req.body.due_back,
            status: req.body.status
        }

        if (errors.isEmpty()) {
            const text =    `INSERT INTO book_instances (book_id, imprint, status, due_back)
                                VALUES ($1, $2, $3, $4);`
            const values = [ Number.parseInt(bkinstance.bookid), bkinstance.imprint, bkinstance.status, bkinstance.dueBack ]

            await pool.query(text, values)

            res.redirect("/bookinstances/")
        } else {
            res.render("bookinstance_form", {
                title: "Create Book Instance",
                errors: errors.array()
            })
        }
    })
]