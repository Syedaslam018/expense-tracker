const express = require("express");

const router = express.Router();

const purchaseController = require("../controlllers/purchase");
const userAuthentication = require("../middleware/auth");

router.get(
  "/buyPremium",
  userAuthentication.authenticate,
  purchaseController.getPurchase
);

router.post(
  "/paymentStatus",
  userAuthentication.authenticate,
  purchaseController.postPurchase
);

module.exports = router;
