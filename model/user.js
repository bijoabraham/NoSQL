const mongoose = require('mongoose');
const validator = require('validator');

//Model for the mongoose db
var User = mongoose.model('User',{
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        unique:true,
        validate:{
            validator:(value)=>{
                return validator.isEmail(value);
            },
            message:`{VALUE} is not a valid email address`
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

module.exports = {User};