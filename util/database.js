// const mongodb=require("mongodb");
// const MongoClient=mongodb.MongoClient;
// let _db;
// const mongoConnect=callback=>{
//     MongoClient.connect("mongodb+srv://saksham:tiwari%40saksham12@cluster0-vvcgd.mongodb.net/shop?retryWrites=true&w=majority",{ useNewUrlParser: true })
// .then(client=>{
//     console.log("connected");
//     _db=client.db();
//     callback(client);
// })
// .catch(err=>{
//     console.log(err)
//     throw err;
// });
// };
// const getDb=()=>{
//     if(_db){
//         return _db;
//     }
//     throw "No database found";
// };

// exports.mongoConnect=mongoConnect;
// exports.getDb=getDb;