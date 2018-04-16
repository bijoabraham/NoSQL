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
app.post('/note',(req,res)=>{
    console.log(req.body);
   var note = new Note({
        title:req.body.title,
        description:req.body.description
    });
    note.save().then((doc)=>{
        console.log('New note from mongoose model',doc);
        res.send(doc);
    }).catch((err)=>{
        console.log('Error writing the note',err);
        return res.status(400).send(err);
    });

});

app.get('/note',(req,res)=>{
    Note.find().then((doc)=>{
        res.send({doc});
    }).catch((err)=>{
        res.sendStatus(404);
    });
});

app.get('/note/:id',(req,res)=>{
    //Check validity of object id
    if(!ObjectID.isValid(req.params.id)){
       return res.sendStatus(404);
    }
    Note.findById(req.params.id).then((doc)=>{
        if(!doc){
            return res.sendStatus(404);
         }
        res.send({doc});
    }).catch((err)=>{
        res.sendStatus(404);
    });
});

app.delete('/note/:id',(req,res)=>{
    //Check validity of object id
    if(!ObjectID.isValid(req.params.id)){
       return res.sendStatus(404);
    }
    Note.findByIdAndRemove(req.params.id).then((doc)=>{
        if(!doc){
            return res.sendStatus(404);
         }
        res.send({doc});
    }).catch((err)=>{
        res.sendStatus(404);
    });
});

app.patch('/note/:id',(req,res)=>{
    //Check validity of object id
    if(!ObjectID.isValid(req.params.id)){
       return res.sendStatus(404);
    }
    var body = _.pick(req.body,['title','description']);
    Note.findOneAndUpdate({_id:new ObjectID(req.params.id)},{
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

app.listen(3000,()=>{
    console.log("Server started...");
});
