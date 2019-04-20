const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schema

const WeishangSchema = new Schema({
  topic: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  captured: {
    type: Date    
  },
  members:[String],
  botWxRef: {
    type: String,
    required: false
  },
},
{
  versionKey:false
});

const weishangs = mongoose.model('weishangs', WeishangSchema);
module.exports = weishangs;