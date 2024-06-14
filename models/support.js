import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title:{
    type:String
  },
  content: {
    type: String,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date, 
    default: Date.now,
  },
  closedby:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  closedAt:{
    type: Date,
  }
});
const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);

export default SupportTicket;
