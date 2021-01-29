const express=require('express');

const router=express.Router();

  //import middlewares
   const {authCheck,adminCheck}=require('../middlewares/auth');

   //controller
const {create,read,update,list}=require('../controllers/author');


router.post("/author", authCheck, adminCheck, create);
router.get("/authors", list);
router.get("/author/:slug", read);
router.put("/author/:slug", authCheck, adminCheck, update);

module.exports=router;  