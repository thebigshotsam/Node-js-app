
const express=require("express");
const shopController=require("../controllers/shop");
const router=express.Router();
router.get("/",shopController.getProduct);
// // router.get("/index",shopController.getIndex);
  router.post("/cart",shopController.postCart);
  router.get("/cart",shopController.getCart);
  router.get("/products",shopController.getProduct);
  router.get("/products/:productId",shopController.getProductDet);
  router.get("/orders",shopController.getOrders);
  router.get("/orders/:orderId",shopController.getInvoice);
  router.post("/cart-delete-item/:productId",shopController.postDeleteCart);
  router.get("/checkout",shopController.getCheckout);
  
 router.get("/create-order",shopController.postCreateOrder);
module.exports=router;