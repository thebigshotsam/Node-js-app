const Product=require("../models/product");
const fs=require("fs");
const PDFDocument=require("pdfkit");
const User=require("../models/user");
const Order=require("../models/order");
const getDb=require("../util/database").getDb;
const mongodb=require("mongodb");
const path2=require("path").join(__dirname,"../","routes","views","shop","shop.ejs");
const path3=require("path").join(__dirname,"../","routes","views","shop","index.ejs");
const path4=require("path").join(__dirname,"../","routes","views","shop","cart.ejs");
const path5=require("path").join(__dirname,"../","routes","views","shop","checkout.ejs");
const path6=require("path").join(__dirname,"../","routes","views","shop","product-detail.ejs");
const path7=require("path").join(__dirname,"../","routes","views","shop","orders.ejs");
const path8=require("path").join(__dirname,"../","routes","views","shop","checkout.ejs");
const pathIn=require("path");
let totalPrice=0;
const ITEM_PER_PAGE=2;
exports.getProduct=(req,res,next)=>{
 let page=+req.query.page;
 let no;
  if(!page){
  page=1;
  }
     Product.find()
     .count()
     .then(noOfProducts=>{
      no=noOfProducts;
     })
     .catch(err=>{
       res.redirect("/500");
     })
     Product.find()
     .skip((page-1)*ITEM_PER_PAGE)
     .limit(ITEM_PER_PAGE)
    .then(products=>{
      
      res.render(path2,{prods:products,pageTitle:"Shop",
      check:"/shop",
      isAuthenticated:req.session.isloggedin,
      csrfToken:req.csrfToken(),
      noofpages:Math.ceil(no/2),
      page:page,
      nextpage:page+1,
      prevpage:page-1
    });
    })
   .catch(err=>{
        res.redirect("/500");
        console.log(err)});
    
 };
 exports.getIndex=(req,res,next)=>{
    const products=Product.fetchAllProducts();
      console.log(products);
    res.render(path3,{prods:products,
      pageTitle:"Shop Index",
      check:"/shop",
    isAuthenticated:req.session.isloggedin,
    hasProducts:products.length>0});
 };
 exports.getCart=(req,res,next)=>{
  if(!req.session.isloggedin){
    return res.redirect("login");
}
   req.user.gettoCart()
   .then((products)=>{
        res.render(path4,{prods:products,
     // totalPrice:carts.totalPrice,
      qpageTitle:"Cart",
      check:"/shop",
      isAuthenticated:req.session.isloggedin,
      csrfToken:req.csrfToken()});
    })
   .catch(err=>{
        res.redirect("/500");
        console.log(err)});
    // const carts=Cart.fetchAllCart();
    // const productsInCart=[];
    // const products=carts.products
    // for(let product of products )
    // {
    //       if(!(Product.findProductById(product.id)===null))
       
    //       productsInCart.push({productData:Product.findProductById(product.id),quanti:product.qty});
    // }
    // res.render(path4,{prods:productsInCart,totalPrice:carts.totalPrice,qpageTitle:"Cart",check:"/shop",hasProducts:products.length>0});
   };
 exports.postDeleteCart=(req,res,next)=>{
  if(!req.session.isloggedin){
    return res.redirect("login");
}
  const prodId=req.params.productId;
  let fetchedCart=req.user.cart;
  fetchedCart=fetchedCart.filter(i=> i.productId.toString() !== prodId);
  req.user.cart=fetchedCart;
 User.findByIdAndUpdate(req.user._id,{$set:{cart:fetchedCart}})
  .then(()=>res.redirect("/cart"))
 .catch(err=>{
        res.redirect("/500");
        console.log(err)});
  // req.user
  // .getCart()
  // .then(cart=>{
  //   fetchedCart=cart;
  //   return cart.getProducts({where:{id:prodId}});
  // })
  // .then(products=>{
  //   let product;
  //   if(products.length>0)
  //   {
  //     product=products[0];
  //   }
    
  //   if(product)
  //   {
  //        return fetchedCart.removeProduct(product);

  //   }
  // })
  // .then(()=>{
  //   res.redirect("/cart");
  // })
  //.catch(err=>{
        // res.redirect("/500");
        // console.log(err)});
};
 exports.postCart=(req,res,next)=>{
  if(!req.session.isloggedin){
    return res.redirect("login");
}
   const prodId=req.body.productId;
  //  Product.findById(prodId)
  //  .then(product=>{
  //    return req.user.addtoCart(product);     
    
  //  })
  //  .then(()=>{
  //   res.redirect("/cart");
  //  })
   const updatedCartItems=[...req.user.cart];
        let cartproductIndex;
        for(let item of updatedCartItems){
            if(item.productId.toString() === prodId)
            {
               
                cartproductIndex=updatedCartItems.indexOf(item);
            }
        }
        let newQuantity=1;
        console.log(cartproductIndex);
        if(cartproductIndex>=0){
          console.log("found");
            newQuantity=updatedCartItems[cartproductIndex].quantity+1;
            updatedCartItems[cartproductIndex].quantity=newQuantity;
            req.user.cart=updatedCartItems;
            console.log(req.user.cart);
            
        }else{  
          console.log("nofound");          
            updatedCartItems.push({productId:new mongodb.ObjectID(prodId),quantity:1});
            req.user.cart=updatedCartItems;
            
       }
        return User.findOneAndUpdate({_id: new mongodb.ObjectID(req.user._id)},{$set:{cart:updatedCartItems}})
        .then(()=>{
          return res.redirect("/cart");
        })
       .catch(err=>{
        res.redirect("/500");
        console.log(err)});
       };
  
   
  
  // .catch(err=>{
  //       res.redirect("/500");
  //       console.log(err)});
  // // //  let fetchedCart;
  //  req.user
  //  .getCart()
  //  .then(cart=>{
  //    fetchedCart=cart;
  //    return cart.getProducts({where:{id:prodId}});
  //  })
  //  .then(products=>{
  //    let product;
  //    if(products.length>0)
  //    {
  //      product=products[0];
  //    }
  //    let newQuantity=1;
  //    if(product)
  //    {
  //      const OldQuanti=product.cartItem.quantity;
  //     return fetchedCart.addProduct(product,{through:{
  //       quantity:OldQuanti+1
  //     }});

  //    }
  //    return Product.findByPk(prodId)
  //    .then(product=>{
  //      return fetchedCart.addProduct(product,{through:{
  //        quantity:newQuantity
  //      }});
  //    })
  //   .catch(err=>{
        // res.redirect("/500");
        // console.log(err)});
  //  })
  //  .then(()=>{
  //   res.redirect("/cart");
  //  })
  // .catch(err=>{
        // res.redirect("/500");
        // console.log(err)});
   
 exports.getProducts=(req,res,next)=>{
  if(!req.session.isloggedin){
    return res.redirect("login");
}
   Product.find()
   .then(products=>{
     res.render(path2,{prods:products,
      pageTitle:"Products",
      check:"/shop",
      isAuthenticated:req.session.isloggedin,
      csrfToken:req.csrfToken()
    });
   })
  .catch(err=>{
        res.redirect("/500");
        console.log(err)});
   
};
 exports.getProductDet=(req,res,next)=>{
  if(!req.session.isloggedin){
    return res.redirect("login");
}
    const prodId=req.params.productId;
      Product.findById(prodId)
    .then((product)=>{
      console.log(product);
      res.render(path6,{product,
        isAuthenticated:req.session.isloggedin,
        csrfToken:req.csrfToken()});
    })
   .catch(err=>{
        res.redirect("/500");
        console.log(err)});
    
     
 };
 
 exports.getOrders=(req,res,next)=>{
  if(!req.session.isloggedin){
    return res.redirect("login");
}
   let i=0;
   Order.find({userId:new mongodb.ObjectID(req.user._id)})
      .then(orders=>{
        
    res.render(path7,{orders:orders,
      isAuthenticated:req.session.isloggedin,
      csrfToken:req.csrfToken()});
    
   })
  .catch(err=>{
        res.redirect("/500");
        console.log(err)});
     };
    //  for(let order of orders){
    //    i=i+1;
    //   console.log(i);
    //  return order.getProducts()
    //  .then(products=>{
    //     orderAry.push(products);
      
     
    // console.log(orderAry);
    // res.render(path7,{orders:orders});
   
   
  
    
exports.postCreateOrder=(req,res,next)=>{
  let fetchedCart;
  
  req.user.gettoCart()
    .then(products=>{
      const i=[];
     for(let edi of products){
       i.push({...edi._doc,quantity:edi.quantity});
     }
     for(let prod of i){
      
      totalPrice=totalPrice+prod.quantity*prod.price;
    }
      const order=new Order({
        products:i,
        userId:new mongodb.ObjectID(req.user._id)
      });
         return order.save();
    })
    
    .then(()=>{
      req.user.cart=[];
      return User.findByIdAndUpdate(req.user._id,{$set:{cart:[]}});
      })
      .then(()=>{
        res.redirect("/orders")
      })
   .catch(err=>{
        res.redirect("/500");
        console.log(err)});
 
   
      //  .then((order)=>
      //  {
      //    console.log(order);
      //  // res.redirect("/orders")
      // })
      // .catch(err=>{
        // res.redirect("/500");
        // console.log(err)});
};
exports.getInvoice=(req,res,next)=>{
  if(req.session.isloggedin){
  const orderId=req.params.orderId;
  const invoice="invoice-"+orderId+".pdf";
  const pathInv=pathIn.join(__dirname,"../","invoice",invoice);
  const pdfDoc=new PDFDocument();
  pdfDoc.pipe(fs.createWriteStream(pathInv));
  pdfDoc.fontSize(26).text("Invoice",{
    underline:true
  });
   totalPrice=0;
  pdfDoc.text("----------------------------------");
  Order.find({userId:new mongodb.ObjectID(req.user._id)})
      .then(orders=>{
        const order=orders.find(i=>{return i._id.toString() === orderId});
        for(let prod of order.products){
          pdfDoc.fontSize(14).text(prod.title+"-"+prod.quantity+"x $"+prod.price);
          totalPrice=totalPrice+prod.quantity*prod.price;
        }
        pdfDoc.text("------");
        pdfDoc.fontSize(20).text("Total Price = $"+totalPrice);
        pdfDoc.end();
      })
      .catch(err=>console.log(err));
      res.setHeader("Content-Type","application/pdf");
      res.setHeader("Content-Disposition","attachment;filename="+invoice);
      pdfDoc.pipe(res);
  // fs.readFile(pathInv,(err,data)=>{
  //   if(err){
  //     return res.redirect("/500")
  //   }
  //   res.setHeader("Content-Type","application/pdf");
  //   res.setHeader("Content-Disposition","attachment;filename="+invoice);
  //   res.send(data);
  // })
  // const file=fs.createReadStream(pathInv);
  //   res.setHeader("Content-Type","application/pdf");
  //   res.setHeader("Content-Disposition","attachment;filename="+invoice);
  //   file.pipe(res);
 }else{
  return res.redirect("/login");
}
}; 
exports.getCheckout=(req,res,next)=>{
  if(!req.session.isloggedin){
    res.redirect("/login");
  }
  totalPrice=0;
  req.user.gettoCart()
  .then((products)=>{
        for(let item of products){
      totalPrice=totalPrice+item.quantity*item._doc.price;
    }
       res.render(path8,{prods:products,
     totalPrice:totalPrice,
     pageTitle:"Cart",
     check:"/shop",
     isAuthenticated:req.session.isloggedin,
     csrfToken:req.csrfToken()});
   })
  .catch(err=>{
       res.redirect("/500");
       console.log(err)});

};
exports.postCheckout=(req,res,next)=>{
  var braintree = require('braintree');
  console.log("come");
    var gateway = braintree.connect({
      environment: braintree.Environment.Sandbox,
      // Use your own credentials from the sandbox Control Panel here
      merchantId: 'pxng5pc279y2zm92',
      publicKey: '3smhcsd9gxjfr67t',
      privateKey: '53091d5f18edeea8bfe8724d5257542d'
    });
    
    // Use the payment method nonce here
    var nonceFromTheClient = req.body.paymentMethodNonce;
    // Create a new transaction for $10
    var newTransaction = gateway.transaction.sale({
      amount: totalPrice.toString(),
      paymentMethodNonce: nonceFromTheClient,
      customer:{
        firstName:"sam"
      },
      options: {
        // This option requests the funds from the transaction
        // once it has been authorized successfully
        submitForSettlement: true
      }
        
    }, function(error, result) {
            if (result) {
        console.log(result);
        res.send(result);
      } else {
        res.status(500).redirect("/500");
      }
  });
    
  };     
       