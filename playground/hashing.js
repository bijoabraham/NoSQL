var {SHA256} = require('crypto-js');

console.log(`hash of test is :${SHA256('test').toString()}`)
var data={
    id:1
}
var token={
    data:data,
    hash:SHA256(JSON.stringify(data)+"salt").toString() //salt is added to prevent user from hacking the id
}
console.log(JSON.stringify(token));
//Working of JWT, actuall implementation is done by jasonwebtoken library

//If someone tampers the data
//token.data=5;
//token.hash=SHA256(JSON.stringify(data)+"").toString(); // no salt is added because the user doenst know the salt

if(token.hash===SHA256(JSON.stringify(data)+"salt").toString()){
    console.log("token hash matches and is valid");    
}
else{
    console.log("token hash matches and is in valid");    
}
//JWT library
var jwt = require('jsonwebtoken');
var data={
    id:'11'
};
var jwtToken=jwt.sign(data,'abc123');
console.log(`JWT token ${jwtToken}`);
var decodedData =jwt.verify(jwtToken,'abc123');
console.log(`decoded from JWT :${JSON.stringify(decodedData)}`);

