const Product =require('../models/product');
const slugify = require("slugify");
const User = require("../models/user");

exports.create=async (req,res) =>{
    try{
        
        req.body.slug=slugify(req.body.title); //get the slugs from title
        const newProduct=await new Product(req.body).save();
        res.json(newProduct);
    } catch (err) {
      console.log(err);
   res.status(400).json({
    err: err.message,
  });
  }
};

exports.listAll=async (req,res)=>{
    let products=await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("author") 
     .sort([['createdAt','desc']])
     .exec()
    res.json(products);
}

exports.remove = async (req, res) => {
    try {
      const deleted = await Product.findOneAndRemove({
        slug: req.params.slug,
      }).exec();
      res.json(deleted);
    } catch (err) {
      console.log(err);
      return res.staus(400).send("Product delete failed");
    }
  };
  
  exports.read = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("author")
      .exec();
    res.json(product);
  };
  
  exports.update = async (req, res) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updated = await Product.findOneAndUpdate(
        { slug: req.params.slug }, //senfd old data
        req.body,
        { new: true }
      ).exec();
      res.json(updated);
    } catch (err) {
      console.log("PRODUCT UPDATE ERROR ----> ", err);
      res.status(400).json({
        err: err.message,
      });
    }
  };
  
  
  exports.list = async (req, res) => {
   
    try {
      // createdAt/updatedAt, desc/asc, 3
      const { sort, order, page } = req.body; //here limit is page
      const currentPage = page || 1; //if we didnt get pageno then by default its 1
      const perPage = 3; //  return 3 products per page
  
      const products = await Product.find({})
        .skip((currentPage - 1) * perPage)  //skip previous page 
        .populate("category")
        .populate("author")
        .sort([[sort, order]])  //sort based on order  sort-createdat/updatedat  order will be asc/desc
        .limit(perPage)
        .exec();
  
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec(); //that funt gives total count mongo funcn
    res.json(total);
  };

  //star
  exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec(); //find id
    const user = await User.findOne({ email: req.user.email }).exec();  //finduser
    const { star } = req.body;
  
    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
      (ele) => ele.postedBy.toString() === user._id.toString() //since mongoid use tostring
    );
  
    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,  //id
        {
          $push: { ratings: { star, postedBy: user._id } },  //push ratings to array
        },
        { new: true }
      ).exec();
      console.log("ratingAdded", ratingAdded);
      res.json(ratingAdded);
    } else {
      // if user have already left rating, update it
      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },  //fetch rating whenratings and  variable are matching
        },
        { $set: { "ratings.$.star": star } },  //update star
        { new: true }
      ).exec();
      console.log("ratingUpdated", ratingUpdated);
      res.json(ratingUpdated);
    }
  };
  

  //related
  exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec(); //gives product from if
  
    const related = await Product.find({
      _id: { $ne: product._id },  //find id not including currently
      category: product.category,  //find based on category
    })
      .limit(3)
      .populate("category")
      .populate("author")
      .populate("postedBy")
      .exec();
  
    res.json(related);
  };
  

  //search filter
  const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query} })  //find based on text(which is wriiten in
    //product schema while creating db so that we can use that to fetch seafrch)
      .populate("category", "_id name")
      .populate("author","_id name")
      .populate("postedBy", "_id name")
      .exec();
  
    res.json(products);
  };
  
  //for prcie
  const handlePrice = async (req, res, price) => {
    try {
      let products = await Product.find({  //fetch all the producst
        price: {          //with price greater than and lesser than
          $gte: price[0],
          $lte: price[1],
        },
      })
        .populate("category", "_id name")
        .populate("author", "_id name")
        .populate("postedBy", "_id name")
        .exec();
  
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };
  //for category filter
  const handleCategory = async (req, res, category) => {
    try {
      let products = await Product.find({ category })
        .populate("category", "_id name")
        .populate("author", "_id name")
        .populate("postedBy", "_id name")
        .exec();
  
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };


  //for star rating
  const handleStar = (req, res, stars) => {
    Product.aggregate([
      {
        $project: {
          document: "$$ROOT", //method which gives acces to entire documnet method
          floorAverage: {  //go to rartings model of star value of each product
            $floor: { $avg: "$ratings.star" }, // floor value of 3.33 will be 3 
          },
        },
      },
      { $match: { floorAverage: stars } },  //checks avg using math
    ])
      .limit(12)
      .exec((err, aggregates) => {
        if (err) console.log("AGGREGATE ERROR", err);
        Product.find({ _id: aggregates })
          .populate("category", "_id name")
          .populate("author", "_id name")
          .populate("postedBy", "_id name")
          .exec((err, products) => {
            if (err) console.log("PRODUCT AGGREGATE ERROR", err);
            res.json(products);
          });
      });
  };

  
  //for shipping

  const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({ shipping })
      .populate("category", "_id name")
      .populate("author", "_id name")
      .populate("postedBy", "_id name")
      .exec();
  
    res.json(products);
  };

  const handleLanguage = async (req, res, lingo) => {
    const products = await Product.find({ lingo })
      .populate("category", "_id name")
      .populate("author", "_id name")
      .populate("postedBy", "_id name")
      .exec();
  
    res.json(products);
  };

  exports.searchFilters = async (req, res) => {
    const { query,price,category,stars,author,shipping ,lingo} = req.body;  //fetch query written by user for searching
  
    if (query) {
      console.log("query", query);
      await handleQuery(req, res, query);
    }

    if (price !== undefined) { //not defined aa 10,100,200.etc
      console.log("price ---> ", price);
      await handlePrice(req, res, price);
    }
    if (category) {
      console.log("category ---> ", category);
      await handleCategory(req, res, category);
    }
    if (stars) {
      console.log("stars ---> ", stars);
      await handleStar(req, res, stars);
    }
   
  if (shipping) {
    console.log("shipping ---> ", shipping);
    await handleShipping(req, res, shipping);
  }
  if (lingo) {
    console.log("Language ---> ", lingo);
    await handleLanguage(req, res, lingo);
  }
   
  };
  