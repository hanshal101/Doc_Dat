const express = require('express');
const path = require('path');
const docRoutes = require('./routes/doctor');
const mongoose = require('mongoose');
const patRoutes = require('./routes/patient');

const server = express();

mongoose.connect("mongodb://127.0.0.1:27017/doctors")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

const PORT = 3500;
server.use(express.urlencoded({ extended: false }));
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));

server.listen(PORT, () => {
  console.log("Server Connected");
});
server.use("/doctor", docRoutes);
server.get('/doctor', (req, res) => {
    res.render('home');
  });

server.get('/signup', (req, res) => {
  res.render('signup');
});

server.get('/signin', (req, res) => {
  res.render('signin');
});

server.get('/addPatient', (req, res) => {
  res.render('addPatient');
});

server.use("/patients", patRoutes);
server.get('/patients', (req, res) => {
    res.render('pat_home');
  });

server.get('/signup', (req, res) => {
  res.render('pat_signup');
});

server.get('/signin', (req, res) => {
  res.render('pat_signin');
});
