const express=require('express');

const router=express.Router();

  //import middlewares
   const {authCheck,adminCheck}=require('../middlewares/auth');

   //controller
const {create,listAll,remove,read,update,list,productsCount,productStar,listRelated,searchFilters
}=require('../controllers/product');



router.post("/product",authCheck,adminCheck,create); //create
router.get("/products/total",productsCount)  //for pagination
router.get("/products/:count",listAll);//get products absed on count
router.delete("/product/:slug",authCheck,adminCheck,remove);//delete producrs based on slug
router.get("/product/:slug",read);
router.put("/product/:slug",authCheck,adminCheck,update);
router.post("/products",list) //with post requests its easily to send data
router.get("/products/total",productsCount)  //for pagination

router.put("/product/star/:productId",authCheck,productStar) //no admincheck since its for user

router.get("/product/related/:productId",listRelated); //related product
router.post("/search/filters",searchFilters) //for search ,post coz one endpoint for many search,filter criteria 
module.exports=router;


