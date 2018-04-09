var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('../db/mongoose');
var {Note} = require('../model/note');

var app = express();

//Set up middlewear
app.use(bodyparser.json());
app.post('/note',(req,res)=>{
    console.log(req.body);
    var newNote = new Note({
        title:req.body.title,
        description:req.body.description
    });
    newNote.save().then((doc)=>{
    console.log('New note from mongoose model',doc);
    }).catch((err)=>{
        console.log('Error writing the note',err);
    });

});

app.listen(3000,()=>{
    console.log("Server started...");
});
