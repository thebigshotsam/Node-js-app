const Product=require("../models/product");
const mongodb=require("mongodb");
const fs=require("fs");
const path=require("path").join(__dirname,"../","routes","views","admin","edit-product.ejs");
const path2=require("path").join(__dirname,"../","routes","views","admin","product-list.ejs");
const expValidator=require("express-validator/check");

exports.getaddProduct=(req,res,next)=>{
    if(!req.session.isloggedin){
        return res.redirect("/login");
    }
    const errors=expValidator.validationResult(req);
    res.render(path,{pageTitle:"Add Product",check:"/admin/add-product",
    editing:false,
    isAuthenticated:req.session.isloggedin,
    csrfToken:req.csrfToken(),
    haserror:false,
    errorMessage:null,
    validationErrors:errors.array()
});
};
exports.postaddProduct=(req,res,next)=>{
    if(!req.session.isloggedin){
        return res.redirect("/login");
    }
    const errors=expValidator.validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render(path,{pageTitle:"Add Product",check:"/admin/add-product",
    editing:false,
    isAuthenticated:req.session.isloggedin,
    csrfToken:req.csrfToken(),
    errorMessage:errors.array()[0].msg,
    haserror:true,
    product:{
        title:req.body.title,
        description:req.body.description,
        price:req.body.price
    },
    expValidator:expValidator,
    validationErrors:errors.array()
    });
    }
   
    if(!req.file){
        req.flash("error","Please select image");
        return res.status(422).render(path,{pageTitle:"Add Product",check:"/admin/add-product",
        editing:false,
        isAuthenticated:req.session.isloggedin,
        csrfToken:req.csrfToken(),
        errorMessage:req.flash("error")[0],
        haserror:true,
        product:{
            title:req.body.title,
            description:req.body.description,
            price:req.body.price
        },
        expValidator:expValidator,
        validationErrors:errors.array()
        });
    }
        const product=new Product({
             title:req.body.title,
             price:req.body.price,
             description:req.body.description,
             imageUrl:req.file.path,
             userId:req.user._id
    });
    console.log(req.file);
    if(!req.file){
        return res.status(422).render(path,{pageTitle:"Add Product",check:"/admin/add-product",
    editing:false,
    isAuthenticated:req.session.isloggedin,
    csrfToken:req.csrfToken(),
    errorMessage:"Attached file is not an image",
    haserror:true,
    product:{
        title:req.body.title,
        imageUrl:req.file,
        description:req.body.description,
        price:req.body.price
    },
    expValidator:expValidator,
    validationErrors:errors.array()
    });
    }
    product.save()
    .then(()=>{
        res.redirect("/");
    })
    .catch(err=>{
        res.redirect("/500");
        console.log(err)});
    };
    // const product=new Product(
    //     req.body.title,
    //     req.body.price,
    //     req.body.description,
    //     req.body.imageUrl,
    //     null,
    //     req.user._id
    // )
    
    

exports.getEditProduct=(req,res,next)=>{
    if(!req.session.isloggedin){
        return res.redirect("/login");
    }
    const editMode=req.query.edit;
    if(!editMode){
    
               
       return res.redirect("/");
    }
    
    const proId=req.params.productId;
    Product.findById(proId)
    .then(product=>{
        if(!product){
            return res.redirect("/");
    }
    return res.render(path,
        {pageTitle:"Edit Product",
         check:"/admin/add-product",
         editing:editMode,
         product,
         errorMessage:null,
         haserror:false,
         isAuthenticated:req.session.isloggedin,
         validationErrors:[],
         csrfToken:req.csrfToken()})
    
    })

    .catch(err=>{
        res.redirect("/500");
        console.log(err)});
};
exports.postEditProduct=(req,res,next)=>{
    if(!req.session.isloggedin){
        return res.redirect("/login");
    }
    const errors=expValidator.validationResult(req);
    const proId=req.params.productId;
       Product.findById(proId)
       .then(product=>{
          
        if(!errors.isEmpty()){
            console.log(product._id);
            return res.render(path,
                {pageTitle:"Edit Product",
                 check:"/admin/add-product",
                 editing:true,
                 product:{
                     _id:proId,
                    title:req.body.title,
                    price:req.body.price,
                    description:req.body.description,
                    
                 },
                 errorMessage:errors.array()[0].msg,
                 haserror:true,
                 isAuthenticated:req.session.isloggedin,
                 validationErrors:errors.array(),
                 csrfToken:req.csrfToken()})
            } 
            
           product.title=req.body.title;
           product.price=req.body.price;
           product.description=req.body.description;
           if(req.file){
           product.imageUrl=req.file.path;
           }
           return product.save();
       }) 
       .then(result=>{
        res.redirect("/");
    }).catch(err=>{
        res.redirect("/500");
        console.log(err)});
    
};
exports.postDeleteProduct=(req,res,next)=>{
    if(!req.session.isloggedin){
        return res.redirect("/login");
    }
    const proId=req.params.productId;
    Product.findById(proId)
    .then(product=>{
        fs.unlink(product.imageUrl,(err)=>{
            if(err){
                return res.redirect("/500");
            }
        });
    })
    .catch(err=>{
        res.redirect("/500");
        console.log(err)});
    Product.findByIdAndRemove(proId)
    .then(result=>{
        res.redirect("/admin/product-list");
    })
    .catch(err=>{
        res.redirect("/500");
        console.log(err)});

};
exports.getProducts=(req,res,next)=>{
    let page=+req.query.page;
    const ITEM_PER_PAGE=2;
    let no;
     if(!page){
     page=1;
     }
    if(!req.session.isloggedin){
        return res.redirect("/login");
    }
    Product.find({userId:req.user._id.toString()})
    .count()
    .then(noOfProducts=>{
     no=noOfProducts;
    })
    .catch(err=>{
      res.redirect("/500");
    })
    Product.find({userId:req.user._id.toString()})
    .skip((page-1)*ITEM_PER_PAGE)
    .limit(ITEM_PER_PAGE)
    .then((products)=>{
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