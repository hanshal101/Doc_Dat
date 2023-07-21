const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');

const patSchema = new Schema(
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
    phno: {
      type: Number,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    }
  },
  { timestamps: true }
);

patSchema.pre("save", function (next) {
  const patient = this;

  if (!patient.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(patient.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

patSchema.statics.matchPassword = async function (email, password) {
  const patient = await this.findOne({ email });
  if (!patient) throw new Error("User not found");

  const userProvHash = createHmac('sha256', patient.salt).update(password).digest("hex");

  if (patient.password !== userProvHash) throw new Error("Incorrect Password");

  return patient;
};

const Patient = model("Patient", patSchema);

module.exports = Patient; // Corrected the typo in the exports statement
