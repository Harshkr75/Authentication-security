require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB" ,{useNewUrlParser:true});

app.listen(3000, function(){
    console.log("The server has started on port 3000");
})

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRETS , encryptedFields:['password']});

const User = mongoose.model("User", userSchema);


app.get("/", function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    console.log(req.body);
    const newUser = new User({
        email:req.body.username,
        password: req.body.password
    });

    newUser.save();
})

app.post("/login",function(req,res){
    var Username = req.body.username;
    var password = req.body.password;

    User.findOne({email:Username}).then(document=>{
       if(document.password===password){
        res.render("secrets");
       }
       else{
        console.log("Wrong password entered!");
       }
    }).catch(err=>{
        console.log(err);
    })
});

