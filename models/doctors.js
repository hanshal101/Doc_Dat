const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');

const docSchema = new Schema(
  {
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
      default: "/images/default.jpg",
    },
    specialization: {
      type: String,
      required: true,
    },
    patients: {
      type: [{
        name: {
          stype: String,
        },
        email: {
          stype: String,
        },
        phno: {
          stype: String,
        },
        address: {
          stype: String,
        },
      }],
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
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

docSchema.pre("save", function (next) {
  const doctor = this;

  if (!doctor.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(doctor.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

docSchema.statics.matchPassword = async function (email, password) {
  const doctor = await this.findOne({ email });
  if (!doctor) throw new Error("User not found");

  const userProvHash = createHmac('sha256', doctor.salt).update(password).digest("hex");

  if (doctor.password !== userProvHash) throw new Error("Incorrect Password");

  return doctor;
};
const Doctor = model("Doctor", docSchema);

module.exports = Doctor;