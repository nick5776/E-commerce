const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already taken"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password length should be greater than 6 character"],
    }, 
    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: [true, "city name is required"],
    },
    country: {
      type: String,
      required: [true, "country name is required"],
    },
    phone: {
      type: String,
      required: [true, "phone no is required"],
    },
    profilePic: {
      public_id: {
        type: String, //used by Cloudinary to identify/delete the file
      },
      url: {
        type: String, //URL to access the uploaded file
      },
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);


/*
The .pre("save") method in Mongoose is a middleware hook that runs just before a document is saved to the MongoDB database using .save().
.pre("save", function () { ... }) lets you run some code automatically right before saving a document — for example:
Hashing a password, Setting default values, Validating or modifying fields
hash func using bcrypt (in blogify we used crypto)

*/
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // in update route we are not updating password toh password ko 2 bar hash mat kro
  this.password = await bcrypt.hash(this.password, 10);
});

// compare function
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

//JWT TOKEN
userSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;