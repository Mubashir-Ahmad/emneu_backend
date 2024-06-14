import stripePackage from "stripe";
import dotenv from 'dotenv';
import payment_schema from "../models/payment.js";
dotenv.config({ path: '../config/config.env' });
// dotenv.config({ path: 'backend/config/config.env' });

console.log(process.env.STRIPE_SECRET_KEY)
// Remove the duplicate declaration of stripe
const stripe = stripePackage('sk_test_51OsorFLCiZBY1uWqDOT7FHViCSvexUHgc0xZaXJU7NKH2vhPGbokyTSCP53KN2DcySzuyhTbJ1yC5nggkZjpRnw300HlRL2YHx');
// const processpayment = catchAsyncError(async (req, res, next) => {
//     // console.log(req.body.paymentData.amount)
//   // console.log('companyid',req.user.companyid)
//   const mypayment = await stripe.paymentIntents.create({
//     amount: '1000',
//     currency: 'usd',
//     metadata: {
//       company: 'Emenu',
//       accessLevel:req.user.accessLevel,
//       workid: req.user.companyid.toString(),
//     },
//   });
//   const paymentMethod = await stripe.paymentMethods.retrieve(mypayment._id);
//   console.log(paymentMethod,mypayment._id)
//   res.status(200).json({ success: true, client_secret: mypayment.client_secret,cardDetail:paymentMethod});
// });
// const processpayment = async (req, res) => {
//   try {
//     const { paymentMethodId } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: '1000', // amount in cents
//       currency: 'usd',
//       payment_method: paymentMethodId,
//       confirm: true,
//       return_url: 'https://www.google.com'
//     });

//     res.status(200).json({ client_secret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred while creating the PaymentIntent.' });
//   }
// };
// const sendstripkey = catchAsyncError(async (req, res, next) => {
//   if (req.method === 'OPTIONS') {
//       res.status(200).end(); 
//     } else {
//       console.log('options')
//     res.status(200).json({ sendstripkey: 'pk_test_51OsorFLCiZBY1uWqig8h5xEbE1KS6otosGiSVjd4TmnVxBk2dNHk44fNkd4L3IvOqREcsKpJYl2qTm7AVxCF5FLL00RF0dIAQO' });
//   }
// });

class paymentController{
  
  static processpayment = async (req, res) => {
    try {
      const { paymentMethodId } = req.body;
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: '1000', // amount in cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        return_url: 'https://www.google.com'
      });
      res.status(200).json({ client_secret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while creating the PaymentIntent.' });
    }
  };
  static sendstripkey = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.status(200).end(); 
      } else {
      res.status(200).json({ sendstripkey: 'pk_test_51OsorFLCiZBY1uWqig8h5xEbE1KS6otosGiSVjd4TmnVxBk2dNHk44fNkd4L3IvOqREcsKpJYl2qTm7AVxCF5FLL00RF0dIAQO' });
    }
  };
  static paymentinfosave = async (req, res, next) => {
    try {
      let companyid;
      console.log('req.body:', req.body);
      console.log('req.body.overseeuser:', req.body.overseeuser);
  
      if (req.body.overseeuser && req.body.overseeuser !== 'undefined') {
        console.log('Processing data for overseeuser');
        companyid = req.body.overseeuser.companyid._id;
        const { brand, last4, exp_month, exp_year } = req.body.paymentinfo.card;
        const result = await payment_schema.create({
          company_id: companyid,
          type: 'card',
          cardInfo: {
            brand: brand,
            last4: last4,
            expMonth: exp_month,
            expYear: exp_year,
            paymentmethodid: req.body.paymentinfo.id,
            paymentIntentid: req.body.paymentinfo.paymentIntentId
          }
        });
        console.log('result1:', result);
        return res.status(200).json({ data: result, success: true });
      } else {
        console.log('Processing data for regular user');
        companyid = req.user.companyid;
        const { brand, last4, exp_month, exp_year } = req.body.card;
        const result = await payment_schema.create({
          company_id: companyid,
          type: 'card',
          cardInfo: {
            brand: brand,
            last4: last4,
            expMonth: exp_month,
            expYear: exp_year,
            paymentmethodid: req.body.id,
            paymentIntentid: req.body.paymentIntentId
          }
        });
        console.log('result6565:', result);
        return res.status(200).json({ data: result, success: true });
      }
    } catch (error) {
      console.log('paymentinfosave_error:', error);
      return res.status(500).json({ error: 'An error occurred while processing payment information.' });
    }
  };
  // GET PAYMENT INFORMATION
  static getpaymentinfo = async(req,res)=>{
    try{
      // const companyid = req.user.companyid;
      let companyid;
      if (req.body.overseeuser) {
        companyid = req.body.overseeuser.companyid._id;
        const data = await payment_schema.find({
          company_id:companyid
        });
       return res.status(200).json({data: data,success: true});
      }
      else{
        companyid = req.user.companyid
        const data = await payment_schema.find({
          company_id:companyid
        });
            return res.status(200).json({data: data,success: true});
      }
      
    }
    catch(error)
    {
      console.log('getpaymentinfo_error',error)
      res.status(500).json({
        error: error.message, // Return error message
        success: false,
      });
    }
  };
  static getsinglepayment = async (req,res) =>{
    try{
      const id = req.query.id;
      const data = await payment_schema.findById(id);
      res.status(200).json({
        data: data,
        success: true,
      });
    }
    catch(error)
    {
      console.log("get_single_payment_error", error);
      res.status(500).json({
        error: error.message, // Return error message
        success: false,
      });
    }
  }
  static achpayment = async(req,res)=>{
    try{
      const { routingNumber, accountNumber, accountHolderName, accountType } = req.body;
      const bankAccountToken = await stripe.tokens.create({
        bank_account: {
          country: 'US',
          currency: 'usd',
          routing_number: routingNumber,
          account_number: accountNumber,
          account_holder_name: req.user.firstName,
          account_holder_type: accountType,
        }
      });
      const customer = await stripe.customers.create({
        source: bankAccountToken.id,
        name:req.user.firstName,
        email:req.user.email
      });
      const result = await payment_schema.create({
        company_id:req.user.companyid,
        type:'ach',
        bankInfo:{
          customerid : customer.id,
          accountNumber : bankAccountToken.bank_account.last4,
          routingNumber : bankAccountToken.bank_account.routing_number
        }
      })
      console.log(customer,bankAccountToken,result)
      res.status(200).json({ success: true, message: 'ACH payment method added successfully.'});
    }
    catch(error){
      console.log('achpayment_error',error);
    }
  };
  static deactivepayment = async(req,res)=>{
    try{
      const id = req.query.id;
      const data = await payment_schema.findById(id);
      console.log(data)
      await payment_schema.updateMany({ company_id: data.company_id }, { $set: { isActive: false } });
      await payment_schema.findByIdAndUpdate(data._id,{isActive:true});
       res.status(200).json({ success: true, message: 'Payment method activated successfully.'});
    }
    catch(error)
    {
      console.log('deactivepayment_error',error);
    }
  }
  static removepayment = async (req,res)=>{
      try{
        const id = req.query.id;
        const data = await payment_schema.findByIdAndDelete(id);
        res.status(200).json({
          data: data,
          success: true,
        });
      }
      catch(error)
      {
        console.log('remove_payment_error',error)
      }
  }
}

export default paymentController;
