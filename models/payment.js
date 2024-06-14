import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
    company_id:{
        type:mongoose.Schema.Types.ObjectId,ref: 'Company'
    },
    type:{
        type:String,
        enum:['card','ach']
    },
    cardInfo: {
      paymentmethodid:String,
      brand: String,
      last4: String,
      expMonth: Number,
      expYear: Number,
      paymentIntentid:String
  },
      bankInfo: {
        customerid:String,
        last4: String,
        routingNumber: String
      },
      isActive: { type: Boolean, default: false }
})
const payment_schema = mongoose.model('payment',paymentMethodSchema);

export default payment_schema