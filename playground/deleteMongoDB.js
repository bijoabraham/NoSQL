//const mongodb = require("mongodb").MongoClient;
//ES 6 destructuring
const {MongoClient,ObjectID} = require("mongodb")

MongoClient.connect("mongodb://localhost:27017/NotesApp",(err,client)=>{
    if(err){
        return "Mongo DB connection failed";
    }
    console.log("Connected to mongo Db");
    const db = client.db("NoteApp");

    //Delete all matching records
    /*db.collection("Note").deleteMany({title:"test", description:"test desciption"},(err,result)=>{
        if(err){
            return console.log("Failed to delete record",err);
        }
        console.log(JSON.stringify(result,undefined,2));        
    });*/

    //Delete first occurance
    /*db.collection("Note").deleteOne({title:"test", description:"test desciption"},(err,result)=>{
        if(err){
            return console.log("Failed to delete record",err);
        }
        console.log(JSON.stringify(result,undefined,2));        
    });*/

    //Find first record and delete it, return the deleted record as well
    db.collection("Note").findOneAndDelete({title:"test", description:"test desciption"},(err,result)=>{
        if(err){
            return console.log("Failed to delete record",err);
        }
        console.log(JSON.stringify(result,undefined,2));        
    });
    client.close();
});