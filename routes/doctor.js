const { Router } = require("express");
const Doctor = require('../models/doctors')
const {randomBytes} = require('crypto');
const router = Router()

router.get('/signup', (req,res)=>{
    res.render('signup');
});

router.get('/signin', (req,res)=>{
    res.render('signin');
});

router.get('/addPatient', (req,res)=>{
    res.render('addPatient');
});

router.get('/addReport',(req,res)=>{
  res.render('addReport');
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
    const authKEY = randomBytes(16).toString('hex');
    await Doctor.create({
        fullName,
        email,
        phno,
        password,
        university,
        degree,
        specialization,
        authKEY
    });
    return res.redirect('/doctor');
});


router.post('/addPatient', async (req, res) => {
    const { name, email, phno, address } = req.body;
    const { authKEY } = req.body;
  
    try {
        const doctor = await Doctor.findOne({authKEY})
        if (!doctor) {
          return res.status(404).json({ error: 'Doctor not found' });
        }
      const d = new Date();
      let dateText = d.toDateString();
      let timeText = d.toTimeString().split(' ')[0];
      const patient_created = dateText + ' ' + timeText; 

      doctor.patients.push({name, email, phno, address , patient_created});
      await doctor.save();
      
      return res.status(201).send("Patient added successfully");
    } catch (error) {
      console.error('Error adding patient:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/addReport', async (req, res) => {
    const { authKEY , phno , reportPDF , description} = req.body;
    console.log(authKEY)
    try {
      const doctor = await Doctor.findOne({ authKEY: req.body.authKEY });
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      
      const patient = doctor.patients.find(patient => patient.phno === phno);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      const d = new Date();
      let dateText = d.toDateString();
      let timeText = d.toTimeString().split(' ')[0];
      let report_created = dateText + ' ' + timeText; 
      patient.reports.push({
        reportPDF,
        description,
        report_created
      });
      await doctor.save();
  
      const patientName = patient.name;
  
      return res.json({ message: `Report of ${patientName} added successfully` });
    } catch (error) {
      console.error('Error adding report:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });
module.exports = router;

