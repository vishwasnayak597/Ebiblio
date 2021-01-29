const Author = require("../models/author");
const slugify = require("slugify");
const Product =require("../models/product");

exports.create = async (req, res) => {
  try {
      //fetch data from frontend entered by user
    const { name } = req.body;
//send json         //create new author  , slug generate based on name
    res.json(await new Author({ name, slug: slugify(name) }).save());
  } catch (err) {
    res.status(400).send("Create author failed");
  }
}; 

exports.list = async (req, res) =>
//                              sort by latest created authr
  res.json(await Author.find({}).sort({ createdAt: -1 }).exec());


exports.read = async (req, res) => {
    //                                  find based on slug from frontend enterd by user
  let author = await Author.findOne({ slug: req.params.slug }).exec();
  const products=await Product.find({author})
  .populate('author')
  .exec();
  res.json({author,products})
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Author.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("author update failed");
  }
};
 
