import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  isActive: { type: Boolean, default: false },
});
const Company = mongoose.model("Company", companySchema);

export default Company ;
