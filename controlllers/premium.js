const Expense = require('../models/expense')
const User = require('../models/user');
const sequelize = require('../util/database');

exports.getData =async (req, res, next) => {
    try{
        const leaderBoardData = await User.findAll({
            attributes: ['id', 'name', 'totalExpenses'],
            group: ['users.id'],
            order: [['totalExpenses', "DESC"]]
        })
    
    
    res.status(201).json(leaderBoardData);
    }
    catch(err){
        res.status(500).json({error: err})
    }
}