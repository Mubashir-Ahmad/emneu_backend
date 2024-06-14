import mongoose from "mongoose"

const menuSchema = new mongoose.Schema({
    user_id: { 
         type: mongoose.Schema.Types.ObjectId,
        ref: 'User' },
    customer_name: {
        type: String,
    },
    payment_type:{
        type:String,
    },
    vehicle: {
        type: String,     
    },
    amount_financed: {
        type: Number,   
    },
    down_payment: {
        type: Number,
    },
    rate_1: {
        type: Number,
       
    },
    rate_2: {
        type: Number,
       
    },
    rate_3: {
        type: Number,

    },
    product_1: {
        type: Number,
       
    },
    product_2: {
        type: Number,
   
    },
    product_3: {
        type: Number,

    },
    term_1: {
        type: Number,

    },
    term_2: {
        type: Number,
     
    },
    term_3: {
        type: Number,
  
    },
    presentation_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'presentation',
        default:null
    },
    balance_due:{
        type: Number,
    },
    total_3:{
        type: Number,
    },
   total_1_2:{
        type: Number,
    },
    total_1:{
        type: Number,
    },
    createdAt:{
        type:Date,
        timestaps: true,
        default:Date.now
    },
})


const menu = mongoose.model('Menu', menuSchema)
export default menu