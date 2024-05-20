const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/******************* Create Product ***************/
const createproduct = catchAsync(
  async (req, res, next) => {
    const {
      name,
      original_price,
      discountper,
      category_name,
      // is_stock,
      size,
      brand,
      color,
      qualityType,
      description,
      sellerId,
      sellerName,
    } = req.body;
    const discounted_price = Math.floor(
      original_price - original_price * (discountper / 100)
    );
    const productimg = req.file.path;
    const newProduct = await Product.create({
      name,
      original_price,
      discounted_price,
      category_name,
      // is_stock,
      rating: 2.5, //default 2.5
      reviews: 0,
      trending: false,
      size,
      brand,
      color,
      qualityType,
      description,
      sellerId,
      sellerName,
      // img: productimg,
    });
    res.status(201).json({
      _id: newProduct._id,
      name,
      discounted_price,
      sellerId,
    });
  },
  (error) => {
    res.status(500).json({ error: "Failed to create new product" });
  }
);

const getAllProducts = catchAsync(async (req, res, next) => {
  const allProducts = await Product.find();
console.log("all pro, is",allProducts);
  res.status(200).json({
    allProducts,
  });
});

const restoreProducts = catchAsync(async (req, res, next) => {
  const productid = req.params.id;
  await Product.restore({ _id: productid });
  const restoredProduct = await Product.findById(productid);
  await restoredProduct.save();
  res.status(200).json({
    restoredProduct,
  });
});

const getSellerProducts = catchAsync(async (req, res, next) => {
  const sellerid = req.params.id;
  const sellerProducts = await Product.find({ sellerId: sellerid });

  if (!sellerProducts || sellerProducts.length === 0)
    return next(new AppError("You have no current orders", 404));

  res.status(200).json({
    success: true,
    totalSellerProducts: sellerProducts.length,
    sellerProducts,
  });
});

const getDeletedSellerProducts = catchAsync(async (req, res, next) => {
  const sellerid = req.params.id;
  const sellerProducts = await Product.findDeleted({ sellerId: sellerid });

  if (!sellerProducts || sellerProducts.length === 0)
    return next(new AppError("You have no current orders", 404));

  res.status(200).json({
    success: true,
    totalSellerProducts: sellerProducts.length,
    sellerProducts,
  });
});

//**************Update Product By Id *********************/
const updateProductById = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const { name, original_price, discountper } = req.body;
  const discounted_price = Math.floor(
    original_price - original_price * (discountper / 100)
  );
  const img = req.file.path;
  const updated = await Product.findByIdAndUpdate(
    id,
    { name, original_price, discounted_price, img },
    {
      new: true,
    }
  );

  if (updated) {
    res.status(201).json({
      msg: "Blog Updated Successfully",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});
//***************************** DELETE A Product ***********************************

const deleteProductById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new AppError("ID is not present in parameter", 403));

  const deletedProduct = await Product.findById(id);
  const deleted = await Product.delete({ _id: id });
  if (deleted) {
    res.status(201).json({
      msg: "Product Deleted Successfully",
      deletedProduct,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const hardDeleteProductById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new AppError("ID is not present in parameter", 403));

  const deletedProduct = await Product.findDeleted({ _id: id });
  const deleted = await Product.findByIdAndDelete(id);
  if (deleted) {
    res.status(201).json({
      msg: "Product Deleted Successfully1",
      deletedProduct,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = {
  createproduct,
  getAllProducts,
  getSellerProducts,
  getDeletedSellerProducts,
  updateProductById,
  deleteProductById,
  hardDeleteProductById,
  restoreProducts,
};