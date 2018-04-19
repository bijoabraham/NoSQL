const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//Model Schema for the mongoose db
var UserSchema = new mongoose.Schema({
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
//instance methods
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
  
    return _.pick(userObject, ['_id', 'email']);
  };
//instance methods
UserSchema.methods.generateAuthToken=function (){
    var user = this;
    var access="auth"
    var token = jwt.sign({_id:user._id.toHexString(),access},"abc123").toString();
    //user.tokens=user.tokens.concat([{access,token}]);
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
}
UserSchema.methods.removeToken=function (token){
    var user = this;
    return user.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    });
};
//model methods ie statics method
UserSchema.statics.findByToken =function(token){
    var User =this;
    var decoded;
    try{
        decoded=jwt.verify(token,"abc123");
        /*console.log(`token ${token}`);
        console.log(`token id ${decoded._id}`);
        console.log(`token ${JSON.stringify(decoded)}`);*/
    }catch(e){
       console.log('Token finding err',e);
       return Promise.reject();
    }
    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
};
UserSchema.statics.findByCredentials =function(email,password){
    return User.findOne({
        email:email
    }).then((user)=>{
        if(!user){
            return Promise.reject();
        }else{
            return new Promise((resolve,reject)=>{
                bcrypt.compare(password,user.password,(err,result)=>{
                    if(result){
                        resolve(user);
                    }
                    reject("incorrect credentials");
                });
            });
        }
    }).catch((err)=>{
        return Promise.reject(err);
    });
};
UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
        });
    }else{
        next();
    }
});

var User = mongoose.model('User',UserSchema);

module.exports = {User};