const { response } = require("express");
let express = require("express");
let router = express.Router();
const adminHelper = require("../helpers/admin-helper");

router.get("/", function (req, res) {
  if(req.session.loggedIn){
    adminHelper.showUser(req.body).then((userDetails) => {
      res.render("admin/adminpage", { userDetails ,admin:true,user:false});
    });

  }else{
    res.render("admin/adminlogin",{admin:false,user:false});
  }
  
});

router.post("/login", (req, res) => {
  // console.log(req.body);
  adminHelper.adminDoLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn=true
      req.session.user = response.user
      adminHelper.showUser(req.body).then((userDetails) => {
        res.render("admin/adminpage", { userDetails ,admin:true,user:false});
      });
    } else {
      res.redirect("/admin");
    }
  });
});

router.get("/adduser", (req, res) => {
  if(req.session.loggedIn){
    res.render("admin/adduser",{admin:true,user:false});
  }else{
    res.redirect("/admin"); 
  }
  
});

router.post("/create", (req, res) => {
  adminHelper.doCreate(req.body).then((response) => {
    // console.log(response);
    res.render("admin/adduser",{admin:true,user:false});
  });
});

router.get("/delete-data", (req, res) => {
  console.log(req.query.id);
  if(req.session.loggedIn){
    adminHelper.deleteUser(req.query.id).then((response) => {
      adminHelper.showUser(req.body).then((userDetails) => {
        res.render("admin/adminpage", { userDetails ,admin:true,user:false});
      });
    });
  }else{
    res.redirect('/admin')
  }
 
});

router.get("/edit", async (req, res) => {
      if(req.session.loggedIn){
        await adminHelper.showOneUser(req.query.id).then((response) => {
          console.log("isjdbck", response);
          res.render("admin/adminedituser",{response,admin:true,user:false});
        });
      }else{
        res.redirect('/admin')
      }
  
});

router.post('/editproduct/:id',(req,res)=>{
  adminHelper.editUser(req.params.id,req.body).then((response)=>{
    adminHelper.showUser(req.body).then((userDetails) => {
    res.render('admin/adminpage',{userDetails,admin:true,user:false})
    })
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy(function(err){
    if(err){
      res.send("Error")
    }else{
      res.redirect('/admin')
    }
  })
})


router.get('*',(req,res)=>{
  res.send(404)
})

module.exports = router;
