import Company from "../models/company.js";
import presentation_model from "../models/presentation.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
class presentationController {
  static presentation_create = async (req, res) => {
    try {
      const { title, coverage, providerInfo, isActive } = req.body;
      const pdfFile = req.file.path;
      console.log(req, "testing req");
      const pdfUploadResult = await cloudinary.uploader.upload(pdfFile, {
        folder: "emenu_pdffile",
        resource_type: "raw",
      });
      const userid = req.user._id;
      const data = await presentation_model.create({
        title: title,
        coverage: coverage,
        providerInfo: providerInfo,
        file: {
          public_id: pdfUploadResult.public_id,
          url: pdfUploadResult.secure_url,
        },
        isActive: isActive,
        user_id: userid,
      });
      res.status(200).json({
        data: data,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.json({ message: error.message, success: false });
    }
  };
  // static getcompanypresentation = async (req, res) => {
  //   try {
  //     const userId = req.user._id;

  //     // Find the user to get the company ID
  //     const user = await User.findById(userId).lean();
  //     if (!user) {
  //       return res
  //         .status(404)
  //         .json({ success: false, error: "User not found" });
  //     }
  //     const companyId = user.companyid;
  //     if((req.user.accessLevel === 'support' || req.user.accessLevel === 'admin' || req.user.accessLevel === 'owner')){
  //       const presentations = await presentation_model
  //     .find()
  //     .populate("user_id");
  //     return res.status(200).json({
  //       success: true,
  //       data: presentations,
  //     });
  //     }
  //     const presentations = await presentation_model
  //     .find({ isActive: true }) // Assuming isActive is the field indicating whether a presentation is active
  //     .populate("user_id");
  //     res.status(200).json({
  //       success: true,
  //       data: presentations,
  //     });
  //   } catch (error) {
  //     console.log("getCompanyPresentations error", error);
  //     res.status(500).json({
  //       success: false,
  //       error: "Internal Server Error",
  //     });
  //   }
  // };
  static getcompanypresentation = async (req, res) => {
    try {
      const userId = req.user._id;
      let companyId;
      console.log('reqq',req.body)
      // Find the user to get the company ID
      const user = await User.findById(userId).lean();
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }
      if (req.body.overseeuser) {
        companyId = req.body.overseeuser.companyid._id;
        const presentations = await presentation_model.find({ isActive: true }).populate("user_id");
          return  res.status(200).json({
              success: true,
              data: presentations,
            });
      }
      else{
        companyId = req.user.companyid;
      }
      if (req.user.accessLevel === 'manager'){
        console.log('called')
        const presentations = await presentation_model.find({ isActive: true }).populate("user_id");
          return  res.status(200).json({
              success: true,
              data: presentations,
            });
      }
      if (req.user.accessLevel === 'support' || req.user.accessLevel === 'admin' || req.user.accessLevel === 'owner') {
        const presentations = await presentation_model
          .find()
          .populate("user_id");
          console.log('ppppppppp')
        return res.status(200).json({
          success: true,
          data: presentations,
        });
      } else {
        let  presentations = [];
        presentations = await presentation_model
        .find({
          $or: [
            { isActive: true }, // Active presentations
            {
              "inactiveCompanies": {
                $elemMatch: {
                  "isActive": false, // Specifically marked as active for the current company
                  "companyId": companyId,
                }
              }
            }
          ]
        })
        .populate("user_id");
        if (req.user.accessLevel == 'standard') {
          presentations = presentations.filter(presentation => {
              const inactiveCompany = presentation.inactiveCompanies.find(company => company.companyId.toString() === companyId.toString() &&  company.isActive === false);
              console.log('1122',inactiveCompany,companyId.toString())
              return !inactiveCompany;
          });
      }
        res.status(200).json({
          success: true,
          data: presentations,
        });
      }
    } catch (error) {
      console.log("getCompanyPresentations error", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  };
  static singlepresentation = async(req,res)=>{
    try{
      console.log('req',req)
      const data = await presentation_model.findById(req.params.id);
      if (!data) return res.status(404).send("presentation not found");
      res.status(200).json({success:true,data:data});
    }
    catch(error){
      console.log('single_presentation_error',error);
      res.status(404).json({success:false,error:error});
    }
  }
  // static deactivatePresentation = async (req, res) => {
  //   try {
  //     const id = req.body.id;
  //     const companyId = req.user.companyid;
  //     const presentation = await presentation_model.findById(id);
  //     if (!presentation) {
  //       return res
  //         .status(404)
  //         .json({ success: false, message: "Presentation not found" });
  //     }

  //     presentation.isActive = req.body.isActive;
   
  //     await presentation.save();
  //     const userId = req.user._id;
  //     const user = await User.findById(userId).lean();
  //     if (!user) {
  //       return res
  //         .status(404)
  //         .json({ success: false, error: "User not found" });
  //     }

  //     const data = await presentation_model
  //       .find({})
  //       .populate("user_id");
  //     res.status(200).json({
  //       success: true,
  //       data: data,
  //       message: "Presentation deactivated successfully",
  //     });
  //   } catch (error) {
  //     console.error("Error deactivating presentation:", error);
  //     res.status(500).json({ success: false, error: "Internal server error" });
  //   }
  // };
  static deactivatePresentation = async (req, res) => {
    try {
      const id = req.body.id;
      let companyId;
      if (req.body.overseeuser){
        console.log('reqq',req.body.overseeuser.companyid._id)
        companyId = req.body.overseeuser.companyid._id;
      }
      else {
        // console.log('ownercalled')
        // Use the company ID of the logged-in user when "oversee" button is not clicked
        companyId = req.user.companyid;
      }
      const presentation = await presentation_model.findById(id);
      if (!presentation) {
        return res
          .status(404)
          .json({ success: false, message: "Presentation not found" });
      }
      
      if(req.user.accessLevel === 'manager'|| req.body.overseeuser){
        console.log('ere')
      const companyIndex = presentation.inactiveCompanies.findIndex(company => company.companyId.toString() === companyId.toString());
        console.log(companyIndex)
      if (companyIndex === -1) {
          presentation.inactiveCompanies.push({ companyId, isActive: req.body.isActive });
          await presentation.save();
          const userId = req.user._id;
          const user = await User.findById(userId).lean();
          if (!user) {
            return res
              .status(404)
              .json({ success: false, error: "User not found" });
          }
      
          let  data = [];
          data = await presentation_model
          .find({
            $or: [
              { isActive: true }, // Active presentations
              {
                "inactiveCompanies": {
                  $elemMatch: {
                    "isActive": false, // Specifically marked as active for the current company
                    "companyId": companyId,
                  }
                }
              }
            ]
          })
          .populate("user_id");
      console.log(data)
        
            return res.status(200).json({
              success: true,
              data: data,
              message: "Presentation deactivated successfully",
            });
      } else {
          presentation.inactiveCompanies[companyIndex].isActive = req.body.isActive;
          await presentation.save();
          const userId = req.user._id;
          const user = await User.findById(userId).lean();
          if (!user) {
            return res
              .status(404)
              .json({ success: false, error: "User not found" });
          }
      
          let  data = [];
          data = await presentation_model
          .find({
            $or: [
              // { isActive: true }, // Active presentations
              {
                "inactiveCompanies": {
                  $elemMatch: {
                    // "isActive": false, // Specifically marked as active for the current company
                    "companyId": companyId,
                  }
                }
              }
            ]
          })
          .populate("user_id");
          console.log('11223344',data)
            return res.status(200).json({
              success: true,
              data: data,
              message: "Presentation deactivated successfully",
            });
      }
    }
    if((req.user.accessLevel === 'support' || req.user.accessLevel === 'admin' || req.user.accessLevel === 'owner')){
      presentation.isActive = req.body.isActive;
      await presentation.save();
      const data = await presentation_model
        .find()
        .populate("user_id");
     return res.status(200).json({
        success: true,
        data: data,
        message: "Presentation deactivated successfully",
      });
    }
  
  
    } catch (error) {
      console.error("Error deactivating presentation:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };
}

export default presentationController;
