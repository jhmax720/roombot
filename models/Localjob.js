
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schema

const LocalJobSchema = new Schema({
    name: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  instance: {
    type: Number,
    required: false
  },
  botWxRef: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  start: {
    type: Date,
    required: false
  },
  end: {
    type: Date,
    required: false
  },
  log: {
    type: String,
    required: false
  },
  
  jobType: {
    type: Number,
    required: false
  },
},
{
  versionKey:false
});

const jobs = mongoose.model('jobs', LocalJobSchema);
module.exports = jobs;