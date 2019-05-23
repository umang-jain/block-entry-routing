var express = require("express"),
    app=express(),
    mongoose=require("mongoose"),
    bodyparser=require("body-parser"),
    expresssanitizer= require("express-sanitizer");

var PORT = process.env.PORT || 3000;

app.use(expresssanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

// Database

mongoose.connect("mongodb://admin123:admin123@ds045011.mlab.com:45011/javascript-router");

var dataSchema = new mongoose.Schema({
    blockid:Number,
    color:String,
    quantity:Number
});
var Data = mongoose.model("Data",dataSchema);

// Routes

app.get("/",function(req,res){
  Data.find({},function(err,data){
     if(err){
         console.log(err);
     }else{
       res.render("home",{data:data});
     }
  });
});

app.get("/newblock",function(req,res){
   res.render("create");
});

app.post("/",function(req,res){
  req.body.entry.color=req.sanitize(req.body.entry.color);
  Data.create(req.body.entry,function(err,data){
     if(err){
         res.render("create");
     }else{
         res.redirect("/");
     }
  });
});

// Port

app.listen(PORT,function(req,res){
   console.log(`Starting Server on port ${PORT}`);
});
