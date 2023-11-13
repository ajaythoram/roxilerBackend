const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const transaction_schema = new Schema({
           id: Number,
           title:String,
           price: Number,
           description:String,
           category:String,
           image:String,
           sold:Boolean,
           dateOfSale: Date,
 })

 module.exports = mongoose.model("roxilr",transaction_schema);