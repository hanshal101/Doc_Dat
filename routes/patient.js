const { Router } = require("express");
const Patients = require('../models/patients');

const router = Router();

router.get('/', (req, res) => {
  res.render('pat_home');
});

router.get('/signup', (req, res) => {
  res.render('pat_signup');
});

router.get('/signin', (req, res) => {
  res.render('pat_signin');
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patients.matchPassword(email, password);
    return res.redirect('/patients');
  } catch (error) {
    console.log("'pat_signin', { error: 'Invalid email or password' }");
  }
});

router.post('/signup', async (req, res) => {
  const {
    fullName,
    email,
    phno,
    password,
    address,
    profileIMG,
  } = req.body;

  await Patients.create({
    fullName,
    email,
    phno,
    password,
    address,
    profileIMG,
  });

  return res.redirect('/patients');
});

module.exports = router;
