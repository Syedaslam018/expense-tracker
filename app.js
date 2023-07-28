const cors = require('cors')
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser');
require('dotenv').config();

const sequelize = require('./util/database');
const User = require('./models/user')
const Expense = require('./models/expense')
const Order = require('./models/order')
const forgotPassword = require('./models/forgotPassword');
const UserS3Files = require('./models/userS3Files')

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
);
const app = express();
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(morgan('combined', {stream: accessLogStream}))

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const forgotPasswordRoute = require('./routes/forgot-password.js')


app.use(bodyParser.json({ extended: false }));

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', forgotPasswordRoute);

app.use((req, res, next) => {
    console.log('abcdefghijklmnopqrstuvwxyz');
    res.sendFile(path.join(__dirname, `public${req.url}`))
})


User.hasMany(Expense)
Expense.belongsTo(User)
cd 
User.hasMany(Order)
Order.belongsTo(User);

User.hasMany(forgotPassword)
forgotPassword.belongsTo(User);

User.hasMany(UserS3Files)
UserS3Files.belongsTo(User)
sequelize
//.sync({force: true})
.sync()
.then(user => {
    app.listen(process.env.PORT)
})
.catch(err => {
    console.log(err)
})