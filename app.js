let express = require('express')
const path = require("path");
const expresslayout =require("express-ejs-layouts");
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const session =require('express-session')
const cookie =require('cookie-parser')

let db = require('./config/connection')
let app =express()
let port =7000


app.use(express.urlencoded({extended:true}));
app.use(session({secret:"key",
saveUninitialized:true,
cookie:{maxAge:600000},
resave:false}))

app.use(cookie())
app.use(function (req, res, next) {
  res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

app.set("views","./views");
app.set("layout","./layout/layout");
app.set("view engine","ejs")





db.connect((err)=>{
    if(err) console.log("Connection Error"+err);
    else console.log("Database Connected successfully");
  })



app.use(expresslayout)
app.use('/',userRouter)
app.use('/admin',adminRouter);


app.listen(port,()=>{
    console.log("server started");
})
