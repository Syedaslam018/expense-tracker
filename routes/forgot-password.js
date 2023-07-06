const express = require('express');

const router = express.Router();

const forgotController = require('../controlllers/forgot-password')

router.post('/forgotPassword',forgotController.forgotPassword)

router.get('/resetPassword/:uuid', forgotController.getResetPassword);

router.post('/resetPassword/', forgotController.postResetPassword)

module.exports = router;