import Company from "../models/company.js";

class CompanyController {
  static company_create = async (req, res) => {
    try {
      console.log(req.body)
      const { name} = req.body;
      let isActive
      if(req.body.isActive == undefined){
      isActive == false
      }
      else{
        isActive = req.body.isActive
      }
      const result = await Company.create({
        name:name,
        isActive:isActive,
      });
      res.status(200).json({
        success:true,
        data:result,
        message:"company created successfully"
      });
    } catch (error) {
        console.log(error)
        res.status(401).json({
            success:false,
            error:error
          });
    }
  };
  static company_get = async (req, res) => {
    try{
      const companies = await Company.find({ name: { $ne: "dextersol" } });
    const data =await Company.find({ name: { $ne: "dextersol" } });
    res.status(200).json({
      data: data,
      success: true,
    });
  }
  catch(error){
    console.log('company_get_error',error)
  }
  }
  static updatecompany = async (req, res) => {
    try {
      const id = req.query.id;  
      // Find the company by ID
      const company = await Company.findById(id);
  
      if (!company) {
        // If no Company found with the provided ID
        return res.status(404).json({
          error: "Company not found",
          success: false,
        });
      }
  let newUserData={}
      // Update only the provided fields
      if (req.body.name !== undefined && req.body.name.trim() !== "") {
        newUserData.name = req.body.name;
      }
  
      if (req.body.isActive !== undefined && req.body.isActive !== null){
        if (typeof req.body.isActive === 'boolean') {
          console.log('heeloo',req.body)
          newUserData.isActive = req.body.isActive;
        }
      }
      const data = await Company.findByIdAndUpdate(company._id, newUserData, {
        new: true,
        runValidators: true,
      });
  
      // Send a success response
      return res.status(200).json({
        message: "Company updated successfully",
        success: true,
        data: data,
      });
    } catch (error) {
      // Handle any errors
      console.log(error)
      return res.status(500).json({
        error: "An error occurred while updating the company",
        success: false,
      });
    }
  }
  static getsinglecompany = async (req, res) => {
    try {
      const id = req.query.id; // Retrieve id from query parameters

      const data = await Company.findById(id);

      if (!data) {
        // If no Company found with the provided id
        return res.status(404).json({
          error: "Company not found",
          success: false,
        });
      }
      res.status(200).json({
        data: data,
        success: true,
      });
    } catch (error) {
      console.log("get_single_company_error", error);
      res.status(500).json({
        error: error.message, // Return error message
        success: false,
      });
    }
  };
}

export default CompanyController;
