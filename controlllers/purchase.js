const Razorpay = require('razorpay');
const Order = require('../models/order');
const jwt = require('jsonwebtoken')
const sequelize = require('../util/database')
require('dotenv').config();

function getWebToken(id,name, boolSome){
    return jwt.sign({id: id, name: name, isPremiumUser: boolSome}, process.env.SECRET_KEY)
}

exports.getPurchase = async (req, res, next) => {
    try{
    let rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    const amount = 2500;

    rzp.orders.create({amount, currency: 'INR'}, async (err, order) => {
        if(err){
            throw new Error(JSON.stringify(err))
        }
        await req.user.createOrder({orderId: order.id, status: 'PENDING'})
        return res.status(201).json({order, key_id: rzp.key_id})
    })
}
catch(err){
    console.log(err)
    res.status(403).json({message: 'something went wrong', error: err});
}
}

exports.postPurchase = async (req, res, next) => {
    const t = await sequelize.transaction()
    // console.log(req.body);
    try{
        const paymentId = req.body.payment_id;
        const orderId = req.body.order_id;
        if(paymentId == -1){
            const order = await Order.findOne({where: {orderId: orderId}})
        const promise1 = order.update({paymentId: paymentId, status: 'FAILED'}, {transaction: t})
        const promise2 =  req.user.update({isPremiumUser: false}, {transaction: t})

        await Promise.all([promise1,promise2])
        t.commit();
        res.status(403).json({success: false, message: 'Transaction Failed'});
        }else{
            const order = await Order.findOne({where: {orderId: orderId}})
            const promise1 = order.update({paymentId: paymentId, status: 'SUCCESSFUL'},{transaction: t})
            const promise2 =  req.user.update({isPremiumUser: true}, {transaction: t})

        await Promise.all([promise1,promise2])
        t.commit();
        res.status(201).json({success: true, message: 'Transaction Successful', token: getWebToken(req.user.id, req.user.name, true)});
        }
        
            
    }
    catch(err){
        console.log(err)
        t.rollback();
        res.status(403).json({message: err})
    }
}
