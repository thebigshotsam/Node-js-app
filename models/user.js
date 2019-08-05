const mongoose=require("mongoose");
const mongodb=require("mongodb");
const Product=require("../models/product");
const Schema=mongoose.Schema;
const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    cart:{
        type:[],
        required:true
    },
});
userSchema.methods.gettoCart=function(){
    const cartItems=this.cart;
        const productIds=cartItems.map(i=>{
            return i.productId;
        });
             return Product.find({_id:{ $in: productIds }})
        
        .then(products=>{
            return products.map(i=>{
                return {...i,
                    quantity:cartItems.find(p=>{
                    return p.productId.toString() === i._id.toString();
                })
                .quantity
            };
            })
        })
        
        .catch(err=>console.log(err));
    };


userSchema.methods.addtoCart=function(product){
    const updatedCartItems=[...this.cart];
    console.log(updatedCartItems);
        let cartproductIndex;
        for(let item of updatedCartItems){
            if(item.productId.toString() === product._id.toString())
            {
               
                cartproductIndex=updatedCartItems.indexOf(item);
            }
        }
        let newQuantity=1;
        console.log(cartproductIndex);
        if(cartproductIndex>=0){
            newQuantity=updatedCartItems[cartproductIndex].quantity+1;
           updatedCartItems[cartproductIndex].quantity=newQuantity;
        }else{            
            updatedCartItems.push({productId:new mongodb.ObjectID(product._id),quantity:1});
       }
       
       this.cart=updatedCartItems;
            return this.save();
       };


module.exports=mongoose.model("User",userSchema);
// const getDb=require("../util/database").getDb;
// const mongodb=require("mongodb");
// class User{
//     constructor(userName,userEmail,cart,id){
//         this.userName=userName;
//         this.userEmail=userEmail;
//         this.cart=cart?cart:[];//{items:[]}
//         this._id=id;
//     }
//     save(){
//     //         return db.collection("users")
//         .insertOne(this);
//     }
//     getCart(){
//         const cartItems=this.cart;
//         const productIds=cartItems.map(i=>{
//             return i.productId;
//         });
//     //         return db.collection("products").find({_id:{ $in: productIds }})
//         .toArray()
//         .then(products=>{
//             return products.map(i=>{
//                 return {...i,
//                     quantity:cartItems.find(p=>{
//                     return p.productId.toString() === i._id.toString();
//                 })
//                 .quantity
//             };
//             })
//         })
//         .catch(err=>console.log(err));
//     }
//     addtoCart(product){
//         const updatedCartItems=[...this.cart];
//         let cartproductIndex;
//         for(let item of updatedCartItems){
//             if(item.productId.toString() === product._id.toString())
//             {
               
//                 cartproductIndex=updatedCartItems.indexOf(item);
//             }
//         }
//         let newQuantity=1;
//         console.log(cartproductIndex);
//         if(cartproductIndex>=0){
//             newQuantity=updatedCartItems[cartproductIndex].quantity+1;
//         //             updatedCartItems[cartproductIndex].quantity=newQuantity;
//             return db.collection("users").updateOne({_id:new mongodb.ObjectID(this._id)},{$set:{cart:updatedCartItems}});
//         }else{            
//             updatedCartItems.push({productId:new mongodb.ObjectID(product._id),quantity:1});
//     //         return db.collection("users").updateOne({_id:new mongodb.ObjectID(this._id)},{$set:{cart:updatedCartItems}});
//         }
//      }
//     static findUserById(userId){
//     //         return db.collection("users").findOne({_id:new mongodb.ObjectID(userId)});//.find() or.findOne() is that .findOne() doen't require next()
        
//     }
//     addorder(){
//     //          return this.getCart()
//         .then((products)=>{
        
//          return db.collection("orders").insertOne({items:products,userId:this._id})
//         .then((result)=>{
//             console.log(result);
//             this.cart=[];
//               return db.collection("users").updateOne({_id:new mongodb.ObjectID(this._id)},{$set:{cart:this.cart}})
//         })
//         .catch(err=>console.log(err));
//         })
//          .catch(err=>console.log(err));
//     }
//     getOrders(){
//         const orderItems=[];
//         let productIds;
//     //         return db.collection("orders").find({userId:this._id}).toArray()
        
//     }

// }
//  module.exports=User;