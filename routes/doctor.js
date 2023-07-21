const { Router } = require("express");
const Doctor = require('../models/doctors')

const router = Router()

router.get('/signup', (req,res)=>{
    res.render('signup');
});

router.get('/signin', (req,res)=>{
    res.render('signin');
});

router.post('/signin', async (req,res)=>{
    const { email , password } = req.body;
    try {
        const doctor = await Doctor.matchPassword(email, password);
        return res.redirect('/doctor');
      } catch (error) {
        console.log("'Doc_signin', { error: 'Invalid email or password' }");
      }
});

router.post('/signup', async (req,res)=>{
    const { fullName,
        email,
        phno,
        password,
        university,
        degree,
        specialization,
    } = req.body;
    await Doctor.create({
        fullName,
        email,
        phno,
        password,
        university,
        degree,
        specialization,
    });
    return res.redirect('/doctor');
});

module.exports = router;

