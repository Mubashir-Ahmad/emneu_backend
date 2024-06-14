import Letterhead from "../models/letterhead.js";
import cloudinary from 'cloudinary'

class letterheadController {
  static company_letterhead = async (req, res) => {
    try {
        
        // const img = req.body.user_img;
        const user_id = req.user._id;
        const company_id = req.user.companyid;
        const img = await cloudinary.v2.uploader.upload(req.body.user_img, {
            folder: "emenu_image",
          });
        // Check if a letterhead already exists for the company
        const existingLetterhead = await Letterhead.findOne({ company_id: company_id });

        if (existingLetterhead) {
            // Update existing letterhead
            if (existingLetterhead.text) {
                console.log('ppp')
                existingLetterhead.text = null;
                const updatedLetterhead = await existingLetterhead.save();
            }
            const updatedLetterhead = await Letterhead.findByIdAndUpdate(existingLetterhead._id, { img: img, user_id: user_id }, { new: true });

            return res.status(200).json({
                success: true,
                data: updatedLetterhead,
                message: "Letterhead updated successfully",
            });
        } else {
            // Create a new letterhead
            const newLetterhead = await Letterhead.create({
                img: {
                public_id:img.public_id,
                url:img.secure_url
                },
                company_id: company_id,
            });

            return res.status(200).json({
                success: true,
                data: newLetterhead,
                message: "Letterhead created successfully",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};
static company_letterhead_Text = async (req, res) => {
    try {

        const company_id = req.user.companyid;
        console.log(req.body)
        const text = req.body.text

        const existingLetterhead = await Letterhead.findOne({ company_id: company_id });

        if (existingLetterhead) {
            existingLetterhead.text = text;
            if (existingLetterhead.img) {
                console.log('ppp')
                existingLetterhead.img = null;
            }
            const updatedLetterhead = await existingLetterhead.save();

            return res.status(200).json({
                success: true,
                data: updatedLetterhead,
                message: "Letterhead updated successfully",
            });
        } else {
            // Create a new letterhead
            const newLetterhead = await Letterhead.create({
              text:text,
              company_id: company_id,
            });
            return res.status(200).json({
                success: true,
                data: newLetterhead,
                message: "Letterhead created successfully",
            });
}
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};
static get_letterhead = async(req,res)=>{
    try{       
         let company_id
         if (req.body.overseeuser) {
        
            // console.log('user',req)
            company_id = req.body.overseeuser.companyid;
          }
          else{
         company_id = req.user.companyid;
          }
        const existingLetterhead = await Letterhead.findOne({ company_id: company_id });
        return res.status(200).json({
            success: true,
            data: existingLetterhead,
        });
    }
    catch(error)
    {
        console.log('get_letterhead_error',error)
    }
}
}


export default letterheadController