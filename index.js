const express = require('express');
const path = require('path');

const server = express();

const PORT = 3500;

server.set("view engine", "ejs");
server.set("views", path.resolve("./views"));

server.listen(PORT,()=>{
    console.log("Server Connected");
});

server.get('/',(req,res)=>{
    res.render('home');
});

server.get('/signup',(req,res)=>{
    res.render('signup');
});