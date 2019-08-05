const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const productSchema=new Schema({
    title:{
        type:String,
        required:true   
    },
    price:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("Product",productSchema);
// const getDb=require("../util/database").getDb;
// const mongodb=require("mongodb");
// class Product{
//     constructor(title,price,imageUrl,description,id,userId){
//         this.title=title;
//         this.price=price;
//         this.imageUrl=imageUrl;
//         this.description=description;
//         this._id=id;
//         this.userId=userId;
//     }
//     save(){
//         const db=getDb();
//         if(this._id){
//              return db.collection("products").updateOne({_id:this._id},{$set:this})
//         }
//         return db.collection("products").insertOne(this)
//         .then(result=>{
//             console.log(result);
//         })
//         .catch(err=>console.log(err));
//     }
//     static fetchAll(){
//         const db=getDb();
//          return db.collection("products")
//         .find().toArray()
//         .then(products=>{
//             return products;
//         })
//         .catch(err=>console.log(err));
//     }
//     static findById(prodId){
//         const db=getDb();
//         return db.collection("products").find({_id:new mongodb.ObjectId(prodId)})// you cant pass id directly because mongodb stores id in BSON format
//         .next()
//         .then(product=>{
//             return product;
//         })
//         .catch(err=>console.log(err));
//     }
//     static deleteById(prodId){
//         const db=getDb();
//         return db.collection("products").deleteOne({_id:new mongodb.ObjectId(prodId)})// you cant pass id directly because mongodb stores id in BSON format
//        .then(result=>{
//             console.log("deleted");
//         })
//         .catch(err=>console.log(err));
//     }
// }

// module.exports=Product;
// // class Product{
// //     constructor(id,title,imageUrl,description,price){
// //         this.title=title;
// //         this.id=id;
// //         this.imageUrl=imageUrl;
// //         this.description=description;
// //         this.price=price;
// //     }
// //     save(){
      
// //     // const p=path.join(path.dirname(process.mainModule.filename),"data","products.json");
// //     //    fs.readFile(p,(err,fileContent)=>{
           
// //     //        if(!err){
// //     //            prodsal=JSON.parse(fileContent);
// //     //        }
   
// //     //        fs.writeFile(p,JSON.stringify(prodsal),(err)=>{
// //     //            console.log(err);
// //     //        });
           
// //     //    });
// //     return db.execute("INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)",
// //     [this.title,this.price,this.description,this.imageUrl]);
      
// //     }
// //     static deleteProductById(id){
       
       
// //     }
// //      static fetchAllProducts()
// //      {
        
// //     //     const p=path.join(path.dirname(process.mainModule.filename),"data","products.json");
// //     //         fs.readFile(p,(err,fileContent)=>{
// //     //         if(err){
// //     //             cb([]);
// //     //         } else{  
// //     //         cb(JSON.parse(fileContent));
// //     //         }
// //     //     });
// //     return db.execute("SELECT * FROM products");
        
// //      }
// //      static findProductById(id){
// //          return db.execute("SELECT * FROM products WHERE products.id = ?",[id]);
         
// //      }
// // };