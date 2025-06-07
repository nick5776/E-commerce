require("dotenv").config(); //always on top

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
const cors=require("cors");
const cookiePaser = require("cookie-parser");
const Stripe = require("stripe");

const testRoute = require("./routes/testRoutes");
const userRoute = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");
const categoryRoute = require("./routes/categoryRoutes");
const orderRoute = require("./routes/orderRoutes");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false })); //parse incoming HTML form 
app.use(express.json()); //parse incoming json payloads
app.use(cors());
app.use(cookiePaser());


const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB Connected"));

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/" , (req,res)=>{
    return res.status(200).send("Hey Welcome!!");
});

app.use("/api/v1",testRoute); 
app.use("/api/v1/user",userRoute); 
app.use("/api/v1/product",productRoute);
app.use("/api/v1/cat",categoryRoute);
app.use("/api/v1/order",orderRoute);

app.listen(PORT, ()=> console.log(`Server started at Port : ${PORT}`));

//app.locals.stripe = stripe;