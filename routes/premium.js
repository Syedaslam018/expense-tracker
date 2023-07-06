const express = require('express');

const router = express.Router();

const premiumController = require('../controlllers/premium')
const userAuthentication = require('../middleware/auth')

router.get('/showLeaderBorad', userAuthentication.authenticate, premiumController.getData);

module.exports = router;