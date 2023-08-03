const UserS3Files = require('../models/userS3Files')

exports.getExpenses = (req, where) => {
    return req.user.getExpenses(where);
}

exports.getOldFiles = (req, where) => {
    return UserS3Files.findAll(where)
}