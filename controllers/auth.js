const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;
   //craeting user with name,picture and email from req.user sent from middleware
  const user = await User.findOneAndUpdate(
    { email },  //find by email
    { name:email.split('@')[0], picture },  //update name and picture
    { new: true }  //return updated user info
  );
  //if user already exists updat
  if (user) {
    console.log("USER UPDATED", user);
    res.json(user);
  } else {
    //create new user
    const newUser = await new User({
      email,
      name:email.split('@')[0],
      picture,
    }).save();
    console.log("USER CREATED", newUser);
    res.json(newUser);
  }
};

//curreent user

exports.currentUser=async (req,res) =>{
  User.findOne({email:req.user.email}).exec((err,user)=>{
    if(err) throw new Error(err)
    res.json(user)
  });
};