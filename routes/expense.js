const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const expenseController = require('../controlllers/expense');
const userAuthentication = require('../middleware/auth')

router.post('/add-expense', userAuthentication.authenticate, expenseController.postExpense)

router.get('/get-expense',userAuthentication.authenticate, expenseController.getExpense)

router.use('/delete-expense/:productId', userAuthentication.authenticate, expenseController.deleteExpense)



module.exports = router;