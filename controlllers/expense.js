const Expense = require('../models/expense');
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const { QueryTypes } = require('sequelize');

const DBServices = require('../services/DBServices')
const S3Services = require('../services/S3Services')
require('dotenv').config();



exports.getExpenses = async (req, res, next) => {
    try{
        const expenses = await DBServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses)
    const userId = req.user.id;
    const filename = `Expenses${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename)
    if(!fileURL){
        throw new Error("Error uploading to s3");
    }
    await UserS3Files.create({url: fileURL, userId: req.user.id});
    res.status(200).json({fileURL, success: true})
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false, error: err})
    }
}

exports.getOldFiles = async(req, res, next) => {
    try{
        const where = {where: {userId: req.user.id}}
        const oldFiles = await DBServices.getOldFiles(req,where)
        res.status(201).json(oldFiles);
    }
    catch(err){
        console.log(err)
        res.send(403).json({succes: false,error: err})
    }
}

exports.postExpense =async(req, res, next) => {
    const t = await sequelize.transaction();
    try{
        const amount  = +req.body.amount;
        const desc = req.body.desc;
        const category = req.body.category;
        const postData = await Expense.create({amount: amount, desc: desc, category: category, userId: req.user.id}, {transaction: t});
        const user = await User.findByPk(req.user.id)
        const result = await user.increment('totalExpenses', {by: amount, transaction: t} )
        await t.commit();
        res.status(201).json(postData);
    }
    catch(err){
        await t.rollback();
        res.status(500).json({message: err})
    }
   
}

exports.getExpense = async (req, res, next) => {
    try{
        const page = +req.query.page;
        const pageSize = +req.query.limit;
        const totalItems = await req.user.getExpenses();
        offset = (page-1)*pageSize;
        limit = pageSize;
        const hasNext = ((totalItems.length) > ((page-1)*pageSize + pageSize))
        const data = await req.user.getExpenses({
            limit,
            offset,
            where: {userId: req.user.id}
        })
        res.status(201).json({
            data: data,
            currentPage: page,
            success: true,
            hasPreviousPage:page>1,
            hasNext: hasNext,
            nextPage: page+1,
            previousPage: page-1,
            lastPage:Math.ceil(totalItems.length/pageSize)

        });
    }
    
    catch(err){
        console.log(err)
        res.status(400).json({success: false, error: "There's been some error!"})
    };
}

exports.deleteExpense = async (req, res, next) => {
    const t= await sequelize.transaction()
    try{
        const userId = req.user.id;
        const prodId = req.params.productId;
        const user = await User.findByPk(userId)
        const expense= await Expense.findByPk(prodId)
        console.log(expense.amount);
        await expense.destroy({where: {id: prodId, userId: userId},transaction: t});
        await user.decrement('totalExpenses', {by: expense.amount, transaction: t});
        await t.commit();
        res.status(201).json({message: 'expense deleted succesfully'});
    }
    catch(err){
        await t.rollback()
        res.status(500).json({message: err})
    }
    
}
exports.dailyExpenses = async (req, res, next) => {
    try{
        const userID = req.user.id;
        const data = await sequelize.query(`SELECT DATE(createdAt) as date,SUM(amount) AS total FROM expenses WHERE userId = ${userID} AND DATE(createdAt) = CURRENT_DATE() GROUP BY DATE(createdAt)`, { type: QueryTypes.SELECT });     
        res.status(200).json({data, success: true});
    }
    catch(err){
        console.log(err)
    res.status(500).json({message: 'error occured!', error:err})}
}
exports.monthlyExpenses = async(req, res, next) => {
try{
    const userID = req.user.id;
    console.log(userID);
    const data = await sequelize.query(`SELECT MONTH(createdAt) AS month,SUM(amount) AS total FROM expenses WHERE userId=${userID} GROUP BY MONTH(createdAt)`, { type: QueryTypes.SELECT });  
    //console.log(data);   
    res.status(200).json({data, success: true});
}
catch(e){
    console.log(e)
    res.status(500).json({message:'error occured', success:false, error: e})
}
}

exports.yearlyExpenses = async(req, res, next) => {
    try{
        const userID = req.user.id;
        const data = await sequelize.query(`SELECT YEAR(createdAt) AS year,SUM(amount) AS total FROM expenses WHERE userId = ${userID} GROUP BY YEAR(createdAt) `, { type: QueryTypes.SELECT });     
        return res.status(200).json({data, success: true});
    }
    catch(e){
        res.status(500).json({message:'error occured!', success:false})
    }
}