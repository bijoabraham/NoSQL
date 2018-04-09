var mongoose = require('mongoose');

//Specify the promise to use for mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/NoteApp");

module.export={mongoose};