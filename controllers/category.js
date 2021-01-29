const Category = require("../models/category");
const slugify = require("slugify");
const Product =require("../models/product");

exports.create = async (req, res) => {
  try {
      //fetch data from frontend entered by user
    const { name } = req.body;
//send json         //create new category  , slug generate based on name
    res.json(await new Category({ name, slug: slugify(name) }).save());
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};

exports.list = async (req, res) =>
//                              sort by latest created category
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec());


  exports.read = async (req, res) => {
    let category = await Category.findOne({ slug: req.params.slug }).exec();
    // res.json(category);
    const products = await Product.find({ category }).populate("category").exec();
  
    res.json({
      category,
      products,
    });
  };
exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Create delete failed");
  }
};
