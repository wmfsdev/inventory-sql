
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