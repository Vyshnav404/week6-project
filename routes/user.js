const express = require("express");
let router = express.Router();
const userHelpers = require("../helpers/user-helper");

router.get("/", (req, res) => {
     if(req.session.userloggedIn){
      res.render("user/userpage",{admin:false,user:true})
     }else{
      res.render("user/userlogin",{admin:false,user:false});
     }
});

router.get("/signupaccount", (req, res) => {
  if(req.session.userloggedIn){
    res.render("user/userpage",{user:true,admin:false})
  }else{
    res.render("user/usersignup",{admin:false,user:false});
  }
  
});

router.post("/login", (req, res) => {
  userHelpers.userDoLogin(req.body).then((response) => {
    if (response.status) {
      req.session.userloggedIn=true
      req.session.user=response.user
      res.render("user/userpage",{user:true,admin:false});
    } else {
      res.redirect("/");
    }
  });
});

router.post("/signup", (req, res) => {
    userHelpers.doSignup(req.body).then((response) => {
      console.log(response);
      res.render("user/userlogin",{user:false,admin:false});
    });
 
});

router.get('/logout',(req,res)=>{
  req.session.destroy(function(err){
    if(err){
      res.send("Error")
    }else{
      res.redirect("/")
    }
  })
 
})

module.exports = router;
