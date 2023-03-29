const express=require('express');

const router=express.Router();

  //import middlewares
   const {authCheck,adminCheck}=require('../middlewares/auth');

   //controller
const {createOrUpdateUser,currentUser}=require('../controllers/auth');


router.post("/create-or-update-user",authCheck,createOrUpdateUser);
router.post("/current-user",authCheck,currentUser);
// checking admin role 
router.post("/current-admin",authCheck,adminCheck,currentUser);

module.exports=router;