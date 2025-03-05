const mongoose = require("mongoose");
const { object, number } = require("yup");
const { Schema } = mongoose;

const UserSchema = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  aadhaar_number: {
    type: Number,
    required: true,
    unique: true,
  },
  dob: {
    type: String, // Consider changing this to Date type for better handling
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  country:{
    type:String
  },
  state:{
    type:String
  },
  dist:{
    type:String
  },
  loc:{
    type:String
  },
  zip: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image:{
    type:String
  },
  rating:{
    type:Number
  },
  feedback: [
    {
      type: Schema.Types.ObjectId,
      ref: "Feedback", // Assuming Feedback is a separate model
      default: [],
    },
  ],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  userType:{
    type:String,
    required:true
  }
});

// Create the model
const User = mongoose.model("User", UserSchema);

module.exports = User;
