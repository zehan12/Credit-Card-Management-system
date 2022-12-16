const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new mongoose.Schema({
    card_number: { type: String, required: true, unique: true },
    name_on_card: { type: String, required: true },
    expiry_date: { type: String, required: true },
    balance: { type: Number, default: 0 },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
 },{
    timestamps:true
 });

 module.exports = mongoose.model("Card",cardSchema);