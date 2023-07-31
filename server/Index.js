const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("This is web");
});

const topupRoute = require("./routes/topupinfo")
app.use('/topup',topupRoute)
const userRoute = require('./routes/user');
app.use("/user", userRoute);
const pointRoute = require('./routes/pointrecord');
app.use("/point", pointRoute);
const productroute = require('./routes/product');
app.use("/product", productroute);
const productrecord = require('./routes/pointrecord');
app.use("productrecord", productrecord);
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);



db.sequelize.sync({ alter: true }).then(() => {
let port = process.env.APP_PORT;
app.listen(port, () => {
console.log(`⚡ Sever running on http://localhost:${port}!`);
});
});
