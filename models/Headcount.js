const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schema

const HeadCountSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  topics:[String]
  
},
{
  versionKey:false
});

const headcounts = mongoose.model('headcounts', HeadCountSchema);
module.exports = headcounts;