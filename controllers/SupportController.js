import SupportTicket from "../models/support.js";

class supportController {
  static createsupport = async (req, res) => {
    try {
        console.log(req)
        const message = req.body.message
        const user = req.user._id;
        const title = req.body.name
        const result = await SupportTicket.create({
            user:user,
            title:title,
            content:message,
        });
        res.status(200).json({
            success:true,
            data:result
        })
    } catch (error) {
      console.log("create_support_error", error);
      res.status(401).json({
        error: error,
        success: false,
      });
    }
  };
  static getsupport = async (req,res)=>{
    try{
      console.log(req.user.companyid)
      const companyId = req.user.companyid
      const result = await SupportTicket.find().populate('user').lean();;
      res.status(200).json({
          success:true,
          data:result
      });
    }
    catch(error){
      console.log('get_support_error',error);
    }
  }
  static getsinglesupport = async(req,res)=>{
   try{
      const data = await SupportTicket.findById(req.params.id).populate('user').populate('closedby')
      console.log(data)
      res.status(200).json({
        success:true,
        data:data
    });
   }
   catch(error)
   {
    console.log('get_support_single_error',error);
   } 
  }
  static supportupdate = async(req,res)=>{
      try{
        const data = await SupportTicket.findById(req.params.id).populate('closedby');
        data.status = "closed";
        data.closedby = req.user._id;
        data.closedAt = new Date();
        await data.save();
        res.status(200).json({success:true,data:data,message:'Support updated successfully'})
      }
      catch(error){
        console.log('supportupdate_error',error);
      }
  }
}
export default supportController;
