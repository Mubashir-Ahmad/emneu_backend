import menuSchema from "../models/menu.js";
import presentation_model from "../models/presentation.js";
import ApiFeacture from "../middleware/apifeacture.js";
import Letterhead from "../models/letterhead.js";
import User from "../models/user.js";
class menuController {
  // API for Adding Menu
  static addMenu = async (req, res) => {
    let presentationId = null;
    const payment_type= req.body.payment_type;
    const customer_name = req.body.customer_name;
    const vehicle = req.body.vehicle;
    const amount_financed = req.body.amount_financed;
    const down_payment = req.body.down_payment;
    const rate_1 = req.body.rate_1;
    const rate_2 = req.body.rate_2;
    const rate_3 = req.body.rate_3;
    const product_1 = req.body.product_1;
    const product_2 = req.body.product_2;
    const product_3 = req.body.product_3;
    const term_1 = req.body.term_1;
    const term_2 = req.body.term_2;
    const term_3 = req.body.term_3;
    const balance_due = req.body.balance_due;
    const total_3 = req.body.total_3;
    const total_1_2 = req.body.total_1_2;
    const total_1 = req.body.total_1
    const presentationTitle = req.body.presentation ? req.body.presentation.title : null;
    if(presentationTitle){
      console.log(req)
      const data = await presentation_model.findOne({
        title: presentationTitle
      });
   
      if (!data) {
        return res.json({
          message: "presentation could not found",
          success: false,
        });
      }
      presentationId = data._id;
    }
    try {
      const result = await menuSchema.create({
        user_id: req.user._id,
        // company_id: req.user.companyid,
        // user_img: user_img,
        customer_name: customer_name,
        vehicle: vehicle,
        amount_financed: amount_financed,
        down_payment: down_payment,
        rate_1: rate_1,
        rate_2: rate_2,
        rate_3: rate_3,
        product_1: product_1,
        product_2: product_2,
        product_3: product_3,
        term_1: term_1,
        term_2: term_2,
        term_3: term_3,
        payment_type:payment_type,
        presentation_id: presentationId,
        balance_due:balance_due,
        total_1:total_1,
        total_1_2:total_1_2,
        total_3:total_3
      });
      console.log("result", result);
      res.json({
        message: "Menu Create Sucessfully",
        data: result,
        success: true,
      });
    } catch (error) {
      console.log(error)
      res.json({ message: "Something Went Wrong", success: false });
    }
  };

  // API for Get All Menus under specific user
  static getMenu = async (req, res) => {
    try {
      let userid;
      if(req.body.overseeuser){
        userid = req.body.overseeuser._id;
      }
      else{
        userid = req.user._id
      }
      console.log('overrrrrrrr',userid)
      const data = await menuSchema.find({ user_id: userid }).populate('user_id');
      console.log("heeloo", data);
      res.status(200).send(data);
    } catch (error) {
      console.log(error)
      res.status(500).send({ error });
    }
  };

  // API for getting Single Menu
  static getSingleMenu = async (req, res) => {
    try {
      console.log('singlecalled',req.params)
      const data = await menuSchema
        .findById(req.params.id)
        .populate("user_id").populate('presentation_id');
        
      const letterhead = await Letterhead.findOne({
        company_id: data.user_id.companyid
      });    
      if (!letterhead) {
        return res
          .status(404)
          .send("Letterhead not found for the company associated with this menu");
      }
      if (!data) return res.status(404).send("Menu not found");
  
      const menuDataWithLetterhead = {
        ...data.toObject(),
        letterhead: letterhead.toObject() // Convert letterhead document to object
      };
  
      res.status(200).json({ success: true, data: menuDataWithLetterhead });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  };
  // Update menu
  // static updateMenu = async (req,res)=>{
  //   try{
  //   let data = await menuSchema.findByIdAndUpdate(req.params.id, req.body.menuData, { new: true });
  //   if (!data) return res.status(404).send("Menu not found");
  //   res.status(200).json({ success: true, data: data });
  //   }
  //   catch(error)
  //   {
  //     console.log('update_menu_error',error)
  //   }
  // }

  static updateMenu = async (req, res) => {
    try {
      let menuData = req.body.menuData;
      let presentationId = null;
  
      // Check if presentation title is provided
      const presentationTitle = menuData.presentation ? menuData.presentation.title : null;
      if (presentationTitle) {
        const presentationData = await presentation_model.findOne({ title: presentationTitle });
  
        if (!presentationData) {
          console.log('presentation not found')
          return res.status(404).json({ message: "Presentation not found", success: false });
        }
  
        presentationId = presentationData._id;
        menuData.presentation_id = presentationId; // Update the presentation ID in the menu data
      }
  
      // Update the menu data
      let updatedMenu = await menuSchema.findByIdAndUpdate(req.params.id, menuData, { new: true });
  
      if (!updatedMenu) {
        return res.status(404).send("Menu not found");
      }
  
      res.status(200).json({ success: true, data: updatedMenu });
    } catch (error) {
      console.log('update_menu_error', error);
      res.status(500).json({ message: "Something went wrong", success: false });
    }
  };
  // API for Deleting Menu
  static deleteMenu = async (req, res) => {
    let data = await menuSchema.findById(req.params.id);
    try {
      if (!data) return res.status(401).send("Not Found");
      if (data.user_id.toString() === req.user._id.toString()) {
        data = await menuSchema.findByIdAndDelete(req.params.id);
        res.send({ message: "Deleted Sucessfully", data });
      } else res.status(401).send({ message: "Not Allowed" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  };
  static filtermenu = async (req, res) => {
    try {
      const resultPerPage = 8;
      const userId = req.user._id; // Assuming you have the user's ID in the request object
      const user = await User.findById(userId); // Assuming you have a User model
  
      // Check if the user is associated with a company
      if (!user || !user.companyid) {
        return res.status(404).json({ success: false, message: "User not found or not associated with a company" });
      }
  
      const companyId = user.companyid;
      console.log(companyId)
      const menuCount = await menuSchema.countDocuments({ company_id: companyId });
  
      const apiFeature = new ApiFeacture(menuSchema.find({ company_id: companyId }), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
  
      const menu = await apiFeature.exec();
  
      const filteredMenuCount = menu.length;
  
      res.status(200).json({
        success: true,
        menu,
        menuCount,
        resultPerPage,
        filteredMenuCount,
      });
    } catch (error) {
      console.log("filter_menu_error", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  

}

export default menuController;
