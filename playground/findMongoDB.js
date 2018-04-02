const {MongoClient,ObjectID} = require("mongodb")

MongoClient.connect("mongodb://localhost:27017/NotesApp",(err,client)=>{
    if(err){
        return "Mongo DB connection failed";
    }
    console.log("Connected to mongo Db");
    const db = client.db("NoteApp");

    //find to get cursor for all the data records, filter object to find records satisfying the filter object
    db.collection("Note").find().toArray().then((data)=>{
        console.log(JSON.stringify(data,undefined,2));
    }).catch((err)=>{
        console.log("Error getting data :"+err);
    })
    //find with filter object
    db.collection("Note").find({title:"sample"}).toArray().then((data)=>{
        console.log("Filter document"+JSON.stringify(data,undefined,2));
    }).catch((err)=>{
        console.log("Error getting data :"+err);
    })
    //filter with object id
    db.collection("Note").find({_id: new ObjectID("5ac19f85ed90f94a1c6431f9")}).toArray().then((data)=>{
        console.log("Filter document with object id :"+JSON.stringify(data,undefined,2));
    }).catch((err)=>{
        console.log("Error getting data :"+err);
    })
    //filter with count
    db.collection("Note").find().count().then((count)=>{
        console.log("Count of notes :"+JSON.stringify(count,undefined,2));
    }).catch((err)=>{
        console.log("Error getting data :"+err);
    })
    client.close();
});