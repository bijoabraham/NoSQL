var mongoose = require('mongoose');

//Specify the promise to use for mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/NoteApp");

//Model for the mongoose db
var note =mongoose.model('note',{
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

var newNote = new note({
   title:'mongoose sample note',
    description:'123'
});

newNote.save().then((doc)=>{
    console.log('New note from mongoose model',doc);
}).catch((err)=>{
    console.log('Error writing the note',err);
});