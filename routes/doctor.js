const { Router } = require("express");
const Doctor = require('../models/doctors')

const router = Router();

router.get('/signup', (req,res)=>{
    res.render('/signup');
});

router.get('/signin', (req,res)=>{
    res.render('/signin');
});

router.post('/signup', async (req,res)=>{
    const {fullName,
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
    return res.redirect('/');
});

module.exports = router;

