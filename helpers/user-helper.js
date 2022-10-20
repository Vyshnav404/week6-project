const { response } = require('express');
const { ObjectId, Collection } = require('mongodb');
const { resolve } = require('path');
const db = require('../config/connection');
const bcrypt = require('bcrypt')

module.exports ={
    userDoLogin:(userdata)=>{
        return new Promise (async(resolve,reject)=>{
            let loginStatus = false
            let response ={}
            let user = await db.get().collection('user').findOne({Name:userdata.username})
            console.log("user is:",user);
            if(user){
            bcrypt.compare(userdata.Password,user.Password).then((status)=>{
                console.log(status);
                if(status){
                    console.log("login success");
                    response.user=user
                    response.status=true
                    resolve(response)
                }else{
                    console.log("Password Wrong");
                    resolve({status:false})
                }
            })
            }else{
                console.log("There is no User");
                resolve({status:false})
            }
        })
    },
    doSignup:(signupData)=>{
        return new Promise(async(resolve,reject)=>{
            signupData.Password=await bcrypt.hash(signupData.Password,10)
            db.get().collection('user').insertOne(signupData).then((data)=>{
                resolve(data)
            })
        })

    }
    
   
}