# NoSQL

1. Start mondo db server
    mongod.exe --dbpath D:\Node\NoSQL\NoSQL\Mongo-data
    mongo.exe 
    robomongo editor

2. Features in mongo db
    node mongo db native
    default object id = time stamp + machine id + process id + counter
    object id can be over written as per application need
    date time stamp can be extracted from object id as well
    ES 6 destructuring to read/assign a property value from an object to a variable
    Find with key and object id
    Mongoose : A MongoDB object modeling tool designed to work in an asynchronous environment.
    Mongoose : Model, Validators, Default, Type, Schema

3. Set up a rest API for mongo db updates
    Express
    Body-parser : As express middlewear
    http status code
    lodash : pick(obj,[])

4. JWT for the Security and Authentication
    crypto-js : SHA256 , hashing and salting for token
    hashing is a one way algorithm
    generate jwt token to each user created and send back as response header

5. Hash password and store in db
    bcryptjs
    mongoose middleware - run fxn before or after an event

6. User login
    user login is compared against the hashed password
    for valid user, a token is returned
7. User logout
    Use $pull of mongoose to remove token from the token array
8. User uthenticate on notes
    create author entry in note entry
    Add authticate middlewear on note operations
    ensure note matches with author id
