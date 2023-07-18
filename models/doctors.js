const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');


const docShema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileIMG: {
        type: String,
        default: "/images/default.jpg"
    },
    specialization: {
        type: String,
        required: true,
    },
    patients: {
        type: Array,
        required: true,
    },
    university: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    phno: {
        type:Number,
        required: true,
    },
},
{ timestamps : true }
);

docShema.pre("save", function (next) {
    const doctor = this;

    if(!doctor.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt).update(doctor.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

const Doctor = model("doctor", docShema);

module.exports = Doctor;