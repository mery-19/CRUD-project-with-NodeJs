const mongoose = require('mongoose');
const { text } = require('express');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title:String,
    description: {
        type:String,
        text:true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
});

const event = mongoose.model('Event',eventSchema);

module.exports = event;