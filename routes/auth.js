const express=require("express");
const authController=require("../controllers/auth");
const expValidator=require("express-validator/check");
const router=express.Router();
router.get("/login",authController.getLogin);
router.post("/login",authController.postLogin);
router.post("/logout",authController.postLogout);
router.get("/signup",authController.signUp);
router.post("/signup",expValidator.check("email")
.isEmail()
.withMessage("Please enter valid email")
,
expValidator.check("password","Enter password of minimum length 5 with both alphabets and numbers ")
.isLength({min:5})
.isAlphanumeric()
,
authController.postsignUp);
router.get("/reset",authController.getReset);
router.get("/reset/:token",authController.getnewPassword);
router.post("/new-password",authController.postnewPassword);
router.post("/reset",authController.postReset);
module.exports=router;