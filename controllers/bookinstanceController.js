
const asyncHandler = require("express-async-handler")
const pool = require("../db/pool")

exports.bkinstance_list = asyncHandler( async(req, res, next) => {
    console.log("book instance list")

    const text =    `SELECT imprint, TO_CHAR(due_back, 'Mon, dd, YYYY') AS due_back, status, title, bk_instance_id FROM book_instances
                     INNER JOIN books
                     ON book_instances.book_id = books.book_id;`

    const { rows } = await pool.query(text)

    console.log(rows)

    res.render("bkinstance_list", {
        title: "Book Instances",
        bkinstance_list: rows,
    })
})

exports.bkinstance_detail = asyncHandler( async(req, res, next) => {
    console.log("book instance detail")

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
    console.log("book instance delete")

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