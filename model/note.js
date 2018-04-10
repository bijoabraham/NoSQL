var mongoose = require('mongoose');

//Model for the mongoose db
var Note = mongoose.model('Note',{
    title:{
        type:String,
        //Model validators
        required:true,
        minLength:3
    },
    description:{
        type:String,
        minlength:3
    }
});

module.exports = {Note};