import mongoose from "mongoose";
const presentationSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    coverage:{
        type:String,
        required:true
    },
    providerInfo:{
        type:String,
        required:true
    },
    file:{
      public_id:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    }
  },
    isActive: {
        type: Boolean,
        default: true
      },
      user_id:{
        type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      },
      inactiveCompanies: [{
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            default:null
        },
        isActive: {
            type: Boolean,
            default: true // Default to active if not specified
        }
    }],
});

const presentation_model = mongoose.model("presentation",presentationSchema)

export default presentation_model