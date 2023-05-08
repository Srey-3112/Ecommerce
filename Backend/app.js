const express= require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const fileUpload=require('express-fileupload');


const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
const dotenv = require("dotenv");
//config
dotenv.config({ path: "Backend/config/config.env" });


const errorMiddleware=require("./middleware/error");
//routes import
const product=require("./routes/productRoutes");
const user=require("./routes/userRoutes");
const order=require("./routes/orderRoutes");
const payment=require("./routes/paymentRoutes");
app.use("/api", product);
app.use("/api", user)
app.use("/api",order);
app.use("/api",payment);
//middleware for error
app.use(errorMiddleware);

module.exports = app