import mongoose from 'mongoose';

const letterheadSchema = new mongoose.Schema({
    img: {
        public_id:{
            type: String,
            // required: true
        },
        url:{
            type: String,
            // required: true
        }
    },
    text:{
        type:String,
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
});

const Letterhead = mongoose.model('Letterhead', letterheadSchema);

export default Letterhead;
