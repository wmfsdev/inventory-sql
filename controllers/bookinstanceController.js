
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