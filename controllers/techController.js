
const asyncHandler = require("express-async-handler")

exports.index = asyncHandler( async(req, res, next) => {
    res.send("TEST INDEX ROUTE HANDLER") // temp
})