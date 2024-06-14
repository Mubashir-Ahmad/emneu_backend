import mongoose from "mongoose";
// import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Define User schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validator:[validator.isEmail,"Please enter valide email"]
  },
  password: {
    type: String,
  },
  accessLevel: {
    type: String,
    enum: ['standard', 'manager', 'support','admin', 'owner'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  overseeingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  companyid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
      },
  resetpasswordToken:String,
  resetpasswordExpire:Date,
});

userSchema.pre("save", async function(next){

  if(!this.isModified("password")){
      next();
  }
  this.password = await bcrypt.hash(this.password,10)
});

// JWT token
userSchema.methods.getJWTtoken = function(){
  return jwt.sign({id:this._id} , process.env.JWT_SECRET,{
      expiresIn:process.env.JWT_EXPIRE,
  });
};

// Compared password
userSchema.methods.comparePassword = async function(enterpassword){
  if (!enterpassword) {
    throw new Error("No password provided for comparison.");
}

// Check if this.password is provided
if (!this.password) {
    throw new Error("No stored password found for comparison.");
}
      return bcrypt.compare(enterpassword,this.password)
}

// Generating password reset token
userSchema.methods.getreset =  function(){
  const resetToken = crypto.randomBytes(20).toString("hex");
  // hashing and adding resetpasswordtoken schema
  this.resetpasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetpasswordExpire= Date.now() + 15*60*1000 ;
  console.log(resetToken)
  return resetToken;
}

// Create User model
const User = mongoose.model('User', userSchema);

export default User
