const _ = require('lodash')
const express = require('express');
const bodyparser = require('body-parser');
const {mongoose} = require('../db/mongoose');
const {Note} = require('../model/note');
const {User} = require('../model/user');
const {ObjectID} = require("mongodb");

var app = express();

//Set up middlewear
app.use(bodyparser.json());
//Auth middleware
var authenticate=(req,res,next)=>{
    var token = req.header("x-auth");
    User.findByToken(token).then((user)=>{
        if(user){
            req.user=user;
            req.token=token;
            //Next needs to be called to execute the middleware
            next();
        }
        else{
            return Promise.reject();
        }
    }).catch((e)=>{
        res.status(404).send();
    });  
};

app.post('/note',authenticate,(req,res)=>{
    console.log(req.body);
   var note = new Note({
        title:req.body.title,
        description:req.body.description,
        _author:req.user._id
    });
    note.save().then((doc)=>{
        console.log('New note from mongoose model',doc);
        res.send(doc);
    }).catch((err)=>{
        console.log('Error writing the note',err);
        return res.status(400).send(err);
    });

});

app.get('/note',authenticate,(req,res)=>{
    Note.find({
        _author:req.user._id
    }).then((doc)=>{
        res.send({doc});
    }).catch((err)=>{
        res.sendStatus(404);
    });
});

app.get('/note/:id',authenticate,(req,res)=>{
    //Check validity of object id
    if(!ObjectID.isValid(req.params.id)){
       return res.sendStatus(404);
    }
    //Note.findById(req.params.id).then((doc)=>{
    Note.findOne({_id:req.params.id,_author:req.user._id}).then((doc)=>{
        if(!doc){
            return res.sendStatus(404);
         }
        res.send({doc});
    }).catch((err)=>{
        res.sendStatus(404);
    });
});

app.delete('/note/:id',authenticate,(req,res)=>{
    //Check validity of object id
    if(!ObjectID.isValid(req.params.id)){
       return res.sendStatus(404);
    }
    //Note.findByIdAndRemove(req.params.id).then((doc)=>{
    Note.findOneAndRemove({_id:req.params.id,_author:req.user._id}).then((doc)=>{
        if(!doc){
            return res.sendStatus(404);
         }
        res.send({doc});
    }).catch((err)=>{
        res.sendStatus(404);
    });
});

app.patch('/note/:id',authenticate,(req,res)=>{
    //Check validity of object id
    if(!ObjectID.isValid(req.params.id)){
       return res.sendStatus(404);
    }
    var body = _.pick(req.body,['title','description']);
    //Note.findByIdAndUpdate(req.params.id,{
    Note.findOneAndUpdate({_id:new ObjectID(req.params.id),_author:req.user._id},{
        $set:{
            title : body.title,
            description : body.description
        }
    },{
        returnOrignal:false
    }).then((doc)=>{
        if(!doc){
            return res.sendStatus(404);
         }
        res.send({doc});
    }).catch((err)=>{
        res.sendStatus(404);
    });
});

app.post('/users',(req,res)=>{ 
    var body = _.pick(req.body,['email','password']);   
    /*var user = new User({
        email:req.body.email,
        password:req.body.password
    });*/
    var user = new User(body);
    user.save().then((doc)=>{
        console.log('New user from mongoose model',doc.email);
        res.send(doc.email);
    }).catch((err)=>{
        console.log('Error creating the user',err);
        return res.status(400).send(err);
    });
});

//User
app.post('/user',(req,res)=>{
var body = _.pick(req.body,['email','password','token']);
   var user = new User({
        email:body.email,
        password:body.password
    });
    user.save().then(()=>{
        //console.log('New user from mongoose model',doc);
        //res.send(doc);
        return user.generateAuthToken();
    }).then((token)=>{
        res.header("x-auth",token).send(user);
    }).catch((err)=>{
        console.log('Error creating the user',err);
        return res.status(400).send(err);
    });

});

//Private route user
app.get('/user/me',authenticate,(req,res)=>{
    res.send(req.user);
    /*var token = req.header("x-auth");
    User.findByToken(token).then((user)=>{
        if(user){
            res.send(user);
        }
        else{
            return Promise.reject();
        }
    }).catch((e)=>{
        res.status(404).send();
    });  */
    });

//log in route
app.post('/user/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header("x-auth",token).send(user);
        })
    }).catch((err)=>{
        res.status(400).send(err);
    });
});

app.delete('/user/me/logout',authenticate,(req,res)=>{    
   req.user.removeToken(req.token).then(()=>{
       res.status(200).send("Successfully logged out");
   }).catch(()=>{
       res.status(400).send();
   })
});

app.listen(3000,()=>{
    console.log("Server started...");
});
