const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
<<<<<<< Updated upstream
    res.send("This is server");
=======
    res.send("This is bank");
>>>>>>> Stashed changes
});

const topupRoute = require("./routes/topupinfo")
app.use('/topup',topupRoute)

const userRoute = require('./routes/user');
app.use("/user", userRoute);

const ezlinkRoute = require("./routes/ezlink")
app.use('/ezlink',ezlinkRoute)

db.sequelize.sync({ alter: true }).then(() => {
let port = process.env.APP_PORT;
app.listen(port, () => {
console.log(`⚡ Sever running on http://localhost:${port}`);
});
});