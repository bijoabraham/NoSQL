const mongodb = require("mongodb").MongoClient;

mongodb.connect("mongodb://localhost:27017/NotesApp",(err,client)=>{
    if(err){
        return "Mongo DB connection failed";
    }
    console.log("Connected to mongo Db");
    const db = client.db("NoteApp");

    db.collection("Note").insertOne({title:"test", description:"test desciption"},(err,result)=>{
        if(err){
            return console.log("Failed to insert record",err);
        }
        //console.log(JSON.stringify(result.ops,undefined,2));        
    });

    db.collection("Users").insertOne({name:"test", location:"test location"},(err,result)=>{
        if(err){
            return console.log("Failed to insert record",err);
        }
        console.log(JSON.stringify(result.ops,undefined,2));        
    });
    client.close();
});