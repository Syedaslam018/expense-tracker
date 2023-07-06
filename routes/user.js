const express = require('express');

const router = express.Router();

const expenseController = require('../controlllers/expense')
const userController = require('../controlllers/user');
const userAuthentication = require('../middleware/auth')

router.post('/signup',userController.addUser)

router.post('/login', userController.getUser)

router.get('/download', userAuthentication.authenticate, expenseController.getExpenses)

router.get('/oldFiles', userAuthentication.authenticate, expenseController.getOldFiles)
module.exports= router;