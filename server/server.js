var _ = require('lodash')
var express = require('express');
var bodyparser = require('body-parser');
var {mongoose} = require('../db/mongoose');
var {Note} = require('../model/note');
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


app.listen(3000,()=>{
    console.log("Server started...");
});
