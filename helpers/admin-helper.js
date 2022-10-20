const bcrypt = require('bcrypt');
const { response } = require('express');
const { ObjectId } = require('mongodb');
const { resolve } = require('path');
const db = require('../config/connection');



module.exports={
    adminDoLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false;
            let response ={}
            // console.log(adminData);
            let admin=await db.get().collection('admin').findOne({username:adminData.username})
            if(admin){
                // compare(adminData.password,admin.password).then((status)=>{
                    if(adminData.password == admin.password){
                        console.log("login success");
                        response.admin=admin
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("login failed")
                        resolve({status:false})
                    }
                // })
            }else{
                console.log("login not success")
                resolve({status:false})
            }
        })
    },
    doCreate:(createData)=>{
        return new Promise (async(resolve,reject)=>{
            createData.Password=await bcrypt.hash(createData.Password, 10)
            console.log(createData);
            db.get().collection('user').insertOne(createData).then((data)=>{
                resolve (data)
            })
        })
    },
    
    showUser:()=>{
        return new Promise(async(resolve,reject)=>{
            let user= await db.get().collection('user').find().toArray()
            resolve(user)
        })
    },

    deleteUser:(id)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection('user').deleteOne({_id:ObjectId(id)}).then((response)=>{
                resolve(response)
            })
        })

    },
    showOneUser:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('user').findOne({_id:ObjectId(id)}).then((response)=>{
                resolve(response)
            })
        })
    },

   editUser:(userid,userDetails)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userDetails)
            userDetails.Password=await bcrypt.hash(userDetails.Password,10)
         db.get().collection('user').updateOne({_id:ObjectId(userid)},{
            $set:{
                Name:userDetails.Name,
                Email:userDetails.Email,
                Password:userDetails.Password
            }
         }).then((response)=>{
            resolve(response)
         })
        })
   }
}