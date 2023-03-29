const admin=require('../firebase/index');
const User=require('../models/user');

//checking data sent from frontend by axios
exports.authCheck = async (req, res, next) => {
   
    try {
        //store it in variable fetched from firebase
      const firebaseUser = await admin
        .auth()
        .verifyIdToken(req.headers.authtoken);
        //verfiy token from req headers of browser with firebase admin
        req.user = firebaseUser;
        //access this variable in controller
      next();
    } catch (err) {
      res.status(401).json({
        err: "Invalid or expired token",
      });
    }
  };

  //for admin security check in middleware

  exports.adminCheck=async (req,res,next)=>{
      const {email} = req.user;

      const adminUser=await User.findOne({email}).exec();

      if (adminUser.role !== "admin") {
        res.status(403).json({
          err: "Admin resource. Access denied.",
        });
      } else {
        next();
      }
    };
    