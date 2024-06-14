import sendtoken from "../middleware/jwt.js";
import User from "../models/user.js";
import SendemailContoroller from "./email.js";
import crypto from "crypto";

class userController {
  static signup = async (req, res) => {
    // if(req.user.companyid === null){
    //   const companyid = null
    // }
    console.log(req)
    let companyId;
    if (req.body.companyid) {

      companyId = req.body.companyid;
    }
    else{
      companyId = req.user.companyid;
    }
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    // const password = req.body.password;
    const accesslevel = req.body.accesslevel;
    let isActive =false
    const companyid = companyId;
    if(req.body.isActive === undefined){
       isActive = false;  
    }else{

      isActive = true
    }
    try {
      // Check Existing Email
      const existingEmail = await User.findOne({ email: email });
      if (existingEmail)
        return res.json({ message: "Email already Exists", success: false });

      const result = await User.create({
        email: email,
        // password: password,
        firstName: firstname,
        lastName: lastname,
        accessLevel: accesslevel,
        isActive: isActive,
        companyid: companyid,
      });

      res.status(200).json({ user: result, success: true });
    } catch (error) {
      console.log("error", error);
      return res.json({ message: error, success: false });
    }
  };
  static login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body)
    if (!email || !password) {
      return res.json({ message: "Fields Can't be null", success: false });
    }
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid email or password", success: false });
      }
      if(user.isActive == false)
      {
         return res
          .status(500)
          .json({ message: "Cannot login contact adminstration", success: false });
      }
      const ispasswordmatched = await user.comparePassword(password);
      console.log('ooii',ispasswordmatched);
      if (!ispasswordmatched) {
        return res
          .status(401)
          .json({ message: "Invalid email or password", success: false });
      }
      // res.status(200).json({success:true,user:user });
      sendtoken(user, 200, res);
    } catch (error) {
      console.log(error);
      res.json({ message: "Something went Wrong", success: false });
    }
  };
  // Oversee user
  static overseeuser = async (req,res)=>{
    try {
      const { companyId } = req.body;
  
      // Find the first manager user ID for the selected company
      const managerUsers = await User.findOne({ companyid: companyId, accessLevel: 'manager' }, '_id');
  
      if (!managerUsers) {
        return res.status(404).json({ message: 'No manager user found for the selected company.' });
      }
  
      const managerUser = await User.findOne({_id: managerUsers._id}).populate('companyid');
      // Redirect the user to the home page of the manager user
      res.status(200).json({ managerUserId: managerUser });
    }
    catch(error)
    {
      console.log('Oversee user',error);
      res.json({ message: "Something went Wrong", success: false });
    }
  }
  // get all user of single company
  // static getallusercompany = async (req, res) => {
  //   try {
  //     const companyid = req.user.companyid;
  //     const users = await User.find({
  //       companyid: companyid,
  //     });
  //     res.status(200).json({
  //       user: users,
  //       success: true,
  //     });
  //   } catch (error) {
  //     console.log("getallusercompany_error", error);
  //     res.status(500).json({
  //       error: error,
  //       success: false,
  //     });
  //   }
  // };
  static getallusercompany = async (req, res) => {
    try {
      console.log('asas')
      let companyId;
      // Check if company ID is present in req.body (when "oversee" button is clicked)
      if (req.body.overseeuser) {
        
        // console.log('user',req)
        companyId = req.body.overseeuser.companyid;
      }
      else if(  req.user.accessLevel === 'owner') {
        const users = await User.find().populate('companyid');
        console.log('called',users)
        return res.status(200).json({
          user: users,
          success: true,
        });
      } 
      else if(req.user.accessLevel === 'admin') {
        console.log('called')
        const users = await User.find({ $or: [{ accessLevel: 'admin' }, { accessLevel: 'support'}, { accessLevel: 'manager'},{accessLevel:'standard'} ] }).populate('companyid');
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      else if(req.user.accessLevel === 'support') {
        console.log('called')
        const users = await User.find({ $or: [ { accessLevel: 'support'}, { accessLevel: 'manager'},{accessLevel:'standard'} ] }).populate('companyid');
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      else if(req.user.accessLevel === 'manager') {
        console.log('callesd')
        companyId = req.user.companyid;
        const users = await User.find({ $or: [  { accessLevel: 'manager',companyid: companyId},{accessLevel:'standard',companyid: companyId} ] });
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      else {
        // console.log('ownercalled')
        // Use the company ID of the logged-in user when "oversee" button is not clicked
        companyId = req.user.companyid;
      }
      // Fetch users belonging to the specified company ID
      const users = await User.find({ companyid: companyId });
      console.log('idds',companyId,users)

      res.status(200).json({
        user: users,
        success: true,
      });
    } catch (error) {
      console.log("getallusercompany_error", error);
      res.status(500).json({
        error: error.message, // Sending error message instead of the entire error object
        success: false,
      });
    }
  };
  // get all user of owner company
  static getallownercompany = async (req, res) => {
    try {
      if(req.user.accessLevel === 'owner') {
        console.log('called')
        const users = await User.find({
          companyid: req.user.companyid,
        });
        return res.status(200).json({
          user: users,
          success: true,
        });
      } 
      else if(req.user.accessLevel === 'admin') {
        console.log('called')
        const users = await User.find({ $or: [{ accessLevel: 'admin' }, { accessLevel: 'support' }] });
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      else if(req.user.accessLevel === 'support') {
        // console.log('called')
        const users = await User.find({ accessLevel:'support'});
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      
      res.status(200).json({
        user: users,
        success: true,
      });
    } catch (error) {
      console.log("getallownercompany_error", error);
      res.status(500).json({
        error: error,
        success: false,
      });
    }
  };
  // get single user
  static getsingleuser = async (req, res) => {
    try {
      const id = req.query.id; // Retrieve id from query parameters

      const data = await User.findById(id);

      if (!data) {
        // If no user found with the provided id
        return res.status(404).json({
          error: "User not found",
          success: false,
        });
      }
      res.status(200).json({
        data: data,
        success: true,
      });
    } catch (error) {
      console.log("get_single_user_error", error);
      res.status(500).json({
        error: error.message, // Return error message
        success: false,
      });
    }
  };

  static deactivateuser = async (req, res) => {
    try {
      console.log('called',req.user.accessLevel)
      const id = req.body.id;
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      user.isActive = req.body.isActive;
      console.log(user);
      await user.save();
      let companyId;
      if (req.body.overseeuser) {
        console.log('overseecalled',req.body.overseeuser._id)
        // console.log('user',req)
        companyId = req.body.overseeuser.companyid;
      }
      else if( req.user.accessLevel === 'owner') {
        console.log('overseecalled')
        const users = await User.find();
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      else if(req.user.accessLevel === 'admin') {
        console.log('called')
        const users = await User.find({ $or: [{ accessLevel: 'admin' }, { accessLevel: 'support'}, { accessLevel: 'manager'},{accessLevel:'standard'} ] });
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      else if(req.user.accessLevel === 'support') {
        console.log('called')
        const users = await User.find({ $or: [ { accessLevel: 'support'}, { accessLevel: 'manager'},{accessLevel:'standard'} ] });
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      else if(req.user.accessLevel === 'manager') {
        console.log('callesd')
        companyId = req.user.companyid;
        const users = await User.find({ $or: [  { accessLevel: 'manager',companyid: companyId},{accessLevel:'standard',companyid: companyId} ] });
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      else {
        companyId = req.user.companyid;
      }
   
        const users = await User.find({
          companyid: companyId,
        });
        // console.log('deactive',users)

      res
        .status(200)
        .json({
          success: true,
          user: users,
          message: "userdeactivated successfully",
        });
    } catch (error) {
      console.error("Error deactivating user:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };
  static ownercompanydeactivateuser = async (req, res) => {
    try {
      const id = req.body.id;
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      user.isActive = req.body.isActive;
      console.log(user);
      await user.save();
      let companyId;
      
      companyId = req.user.companyid;
      if(req.user.accessLevel === 'owner') {
        console.log('called')
        const users = await User.find({
          companyid: req.user.companyid,
        });
        return res.status(200).json({
          user: users,
          success: true,
        });
      } 
      else if(req.user.accessLevel === 'admin') {
        console.log('called')
        const users = await User.find({ $or: [{ accessLevel: 'admin' }, { accessLevel: 'support' }] });
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      else if(req.user.accessLevel === 'support') {
        // console.log('called')
        const users = await User.find({ accessLevel:'support'});
        return res.status(200).json({
          user: users,
          success: true,
        });
      }
      const users = await User.find({
        companyid: companyId,
      });
      console.log('deactive',users)
      res
        .status(200)
        .json({
          success: true,
          user: users,
          message: "userdeactivated successfully",
        });
    } catch (error) {
      console.error("Error deactivating user:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };
  static loaduser = async (req, res) => {
    try {
      console.log("req", req.user);
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      // console.log("load_user", error);
      res.status(400).json({
        success: false,
        message: error,
      });
    }
  };
    // register password link send
    static updateuser = async (req, res, next) => {
      const email = req.body.email;
      const id = req.query.id;  
      // Find the company by ID
      try {
        const user = await User.findById(id);
        // const user = await User.findOne({ email });
  
        if (!user) {
          return res.status(404).json({
            success: false,
            message: `No user found with email ${email}`,
          });
        }
        let newUserData={}
        // Update only the provided fields
        if (req.body.firstname !== undefined && req.body.firstname.trim() !== "") {
          newUserData.firstName = req.body.firstname;
        }
        if (req.body.lastname !== undefined && req.body.lastname.trim() !== "") {
          newUserData.lastName = req.body.lastname;
        }
        if (req.body.accesslevel !== undefined && req.body.accesslevel.trim() !== "") {
          newUserData.accessLevel = req.body.accesslevel;
        }
        if (req.body.email !== undefined && req.body.email.trim() !== "") {
          newUserData.email = req.body.email;
        }
        if (req.body.isActive !== undefined && req.body.isActive !== null){
          if (typeof req.body.isActive === 'boolean') {
            console.log('heeloo',req.body)
            newUserData.isActive = req.body.isActive;
          }
        }
        const data = await User.findByIdAndUpdate(user._id, newUserData, {
          new: true,
          runValidators: true,
        });
    
        const resetToken = user.getreset();
        await user.save({ validateBeforeSave: false });
        console.log(resetToken,user)
      const registrationUrl = `${process.env.FRONTEND_URL}/registerpassword/${resetToken}`;
      const message = `Welcome! Please follow this link to complete your registration: \n\n${registrationUrl}\n\nIf you did not request this, please ignore this email.`;
        await SendemailContoroller.sendEmail({
          email: email,
          subject: "eMenufi Complete Your Registration",
          message,
        });
        console.log(data)
        res.status(200).json({
          success: true,
          message: `Email send to ${email} successfully`,
          data:data
        });
      } catch (error) {
        console.log("sendemailerror", error);
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    };
  // register password link send
  static registeruserpassword = async (req, res, next) => {
    const email = req.body.email;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `No user found with email ${email}`,
        });
      }
      const resetToken = user.getreset();
      await user.save({ validateBeforeSave: false });
      console.log(resetToken,user)
    const registrationUrl = `${process.env.FRONTEND_URL}/registerpassword/${resetToken}`;
    const message = `Welcome! Please follow this link to complete your registration: \n\n${registrationUrl}\n\nIf you did not request this, please ignore this email.`;
      await SendemailContoroller.sendEmail({
        email: email,
        subject: "eMenufi Complete Your Registration",
        message,
      });
      res.status(200).json({
        success: true,
        message: `Email send to ${email} successfully`,
      });
    } catch (error) {
      console.log("sendemailerror", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  static savedpassword = async(req,res,next)=>{
    try{
      const { newPassword } = req.body;
      console.log('asasas',newPassword,req.params)
      const hashedToken =  crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
      const user = await User.findOne({
        resetpasswordToken: hashedToken,
        resetpasswordExpire: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json({ message: 'Token is invalid or has expired.' });
      }
      user.password = newPassword;
      user.resetpasswordToken = undefined;
      user.resetpasswordExpire = undefined;
      await user.save();
      res.status(200).json({success:true, message: 'Password updated successfully. Please log in.' });
    }
    catch(error)
    {
      console.log('savedpassword_error',error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  // reset password link send 
  static resetpassword = async (req, res, next) => {
    let email;
    console.log(req.body)
    if (req.body.overseeuser) {
    email = req.body.overseeuser.email;
    }
    else{
      email= req.body.email
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    console.log(user);
    // Get reset password token
    const resetToken = user.getreset();
    
    console.log(resetToken);
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    console.log(resetPasswordUrl);
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested please ignore it `;
    try {
      await SendemailContoroller.sendEmail({
        email: user.email,
        subject: "eMenufi Password Recovery",
        message,
      });
      res.status(200).json({
        success: true,
        message: `Email send to ${user.email} successfully`,
      });
    } catch (error) {
      (user.resetpasswordExpire = undefined),
        (user.resetpasswordToken = undefined),
        await user.save({ validateBeforeSave: false });
      console.log("error_", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  static updatepassword = async (req, res, next) => {
    try {
      console.log("req", req.body);
      const resetpasswordtoken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
      const user = await User.findOne({
        resetpasswordtoken,
        resetpasswordExpire: { $gt: Date.now() },
      });
      console.log(user);
      if (!user) {
        console.log("as");
        res.status(400).json({
          success: false,
          message: "Invalid Token or has been expired",
        });
        // return next(new ErrorHandler("Invalid Token or has been expired", 400));
      }
      if (req.body.password !== req.body.confrimpassword) {
        res.status(400).json({
          success: false,
          message: "Password does not matched",
        });
        // return next(new ErrorHandler("Password does not matched", 400));
      }
      console.log(user);
      user.password = req.body.confrimpassword;
      (user.resetpasswordExpire = undefined),
        (user.resetpasswordToken = undefined),
        await user.save();
      sendtoken(user, 200, res);
    } catch (err) {
      console.log("hello", err);
    }
  };
}

export default userController;
