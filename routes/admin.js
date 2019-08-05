const path=require("path").join(__dirname,"views","add-product.ejs");
const expValidator=require("express-validator/check");
const express=require("express");
const adminController=require("../controllers/admin");
const router=express.Router();

 router.get("/add-product",adminController.getaddProduct);
router.get("/product-list",adminController.getProducts);
 router.get("/edit-product/:productId",adminController.getEditProduct);
router.post("/edit-product/:productId",
expValidator.check("title","title must contains texts and numbers only and of minimum length 3")
 .isAlphanumeric()
 .isLength({min:3})
 .trim(),
  expValidator.check("price")
 .isFloat()
 .withMessage("Invalid Price"),
 expValidator.check("description")
 .isLength({min:3,max:400})
 .withMessage("Description should be of minimum length 8 and maximum length 400")
 .trim(),adminController.postEditProduct);
 router.post("/delete-product/:productId",adminController.postDeleteProduct);
 router.post("/add-product",
 expValidator.check("title","title must contains texts and numbers only and of minimum length 3")
 .isAlphanumeric()
 .isLength({min:3})
 .trim(),
  expValidator.check("price")
 .isFloat()
 .withMessage("Invalid Price"),
 expValidator.check("description")
 .isLength({min:3,max:400})
 .withMessage("Description should be of minimum length 8 and maximum length 400")
 .trim(),adminController.postaddProduct);

module.exports=router;

