const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModels");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

//create Product(admin)
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

//get all product
exports.getAllProducts = catchAsyncError(async (req, res,next) => {
  const resultPerPage = 4;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
  .search()
  .filter()
  .pagination(resultPerPage)
    
    
  const products= await apiFeature.query;  

    
    
  res.status(200).json({ success: true, products, productCount,resultPerPage });
});

//getProductDetails
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//update product(admin)
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let uProduct = await Product.findById(req.params.id);
  if (!uProduct) {
    return next(new ErrorHandler("Product not found", 404));
  }

  uProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    uProduct,
  });
});

//Delete a product(Admin)
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Product removed successfully",
  });
});

//create new review or update
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    }) 
    
    product.ratings =avg / product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
      success: true,
    })
});

//Get all product reviewa
exports.getAllProductReviews=catchAsyncError(async (req,res,next)=>{

  const product= await Product.findById(req.query.productId)

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

//Delete product reviews
exports.deleteProductReviews=catchAsyncError(async (req,res,next)=>{

  const product= await Product.findById(req.query.productId)

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.revId.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }
  const numberOfReviews = reviews.length

  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    numberOfReviews,
    ratings
  },{
    new:true,
    runValidators: true,
    useFindAndModify:false
  })



  res.status(200).json({
    success: true,
  })
})
