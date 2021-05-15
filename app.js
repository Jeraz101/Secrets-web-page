//jshint esversion:6

require("dotenv").config() //download npm i dotenv in our jeff_eye_project and create .env file.open .env file and cut out our secret and paste it there. check .nv file to see how to do it.
const express = require("express"); //
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption") //check to see if this is connected in our jeff_eye_project





const app = express();


app.set('view engine', 'ejs'); //basically for ejs

app.use(express.static("public"));/*when our browser makes a get request to our server.
The bootstrap and the css disappears or not incoporated in it. to solve this we need to use a special function of express,
known as app.use(express.static())*/
app.use(bodyParser.urlencoded({extended:true}));//tells our server to use body-parser for post request

mongoose.connect("mongodb://localhost:27017/userDB",  {useUnifiedTopology: true, useNewUrlParser: true})

const userSchema = new mongoose.Schema({ //https://www.npmjs.com/package/mongoose-encryption

  email:String,
  password: String
});

//check to see if this is in our jeff_eye_project

userSchema.plugin(encrypt, {secret: process.env.SECRET,  encryptedFields: ["password"]});//this encrypts only the password field. if you exclude encryptedFields then it will encrpt the whole database.



//create our model which is User and connect it to our collection which is user, and this will use the userSchema
const User = new mongoose.model("User", userSchema); //check to see if this is connected in our jeff_eye_project


app.get("/", function(req, res){
  res.render("home")
});

app.get("/login", function(req, res){
  res.render("login")
});

app.get("/register", function(req, res){
  res.render("register")
});




app.post("/register", function(req, res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })
})


app.post("/login", function(req, res){

const email = req.body.username;
const password = req.body.password;

User.findOne({email: email}, function(err, foundUser){

  if(err){
    console.log(err);
  }else{
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets")
      }else{
        res.send("wrong password")
      }
    }else{

      res.send("wrong email")
    }
  }
})

})

//level 1, adding only password
//LEVEL 2 encrpyting our user passwords: Encrpytion


//Things to do for jeff_eye_project
/*create .gitignore
check the gitignore in secrets, copy and paste in gitignore of jeff_eye_project
*/






app.listen(3000, function(){
  console.log("server started at port 3000");
})


//Dot.env(https://www.npmjs.com/package/dotenv)
//a file to save our important information, so it wont be shared online.

/*Difference between res.render and res.sendFile


res.render is used to render (or display) a template file (either html or ejs), while res.send can be used to give a feedback when a http request is made, the feedback may be in form of json or a simple text.*/
