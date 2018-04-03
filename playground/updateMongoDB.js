const {MongoClient,ObjectID} = require("mongodb")

MongoClient.connect("mongodb://localhost:27017/NotesApp",(err,client)=>{
    if(err){
        return "Mongo DB connection failed";
    }
    console.log("Connected to mongo Db");
    const db = client.db("NoteApp");

    //Update one record
    db.collection("Note").updateOne({_id:new ObjectID("5ac19f85ed90f94a1c6431f9")},{
        $set:{
            description : "desciption updated"
        }
    },{
        returnOrignal:false
    }
    ).then((data)=>{
        console.log("Document"+JSON.stringify(data,undefined,2));
    }).catch((err)=>{
        console.log("Error getting data :"+err);
    });
    //Find one record update and return the documnet
    db.collection("Note").findOneAndUpdate({_id:new ObjectID("5ac19f85ed90f94a1c6431f9")},{
        $set:{
            description : "desciption updated"
        }
    },{
        returnOrignal:false
    }
    ).then((data)=>{
        console.log("Document"+JSON.stringify(data,undefined,2));
    }).catch((err)=>{
        console.log("Error getting data :"+err);
    });
    client.close();
});