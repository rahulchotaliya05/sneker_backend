const express = require("express");
const productController = require("../Controllers/productController");
const IDvalidation = require("../Middleware/IDvalidation");
const upload = require("../Middleware/multerSetup");

const router = express.Router();

// // *****************************GET ALL PRODUCTS*****************************
router.get("/getAllProducts", productController.getAllProducts);

// **********************************CREATE A NEW PRODUCT********************
router.post(
  "/create-product",
  upload.single("productimg"),
  productController.createproduct
);

router.post("/restoreProducts/:id?", productController.restoreProducts);
// //****************************GET PRODUCTS BY SELLER ID*****************************

router.get(
  "/getSellerProducts/:id?",
  IDvalidation,
  productController.getSellerProducts
);

router.get(
  "/getDeletedSellerProducts/:id?",
  IDvalidation,
  productController.getDeletedSellerProducts
);
router
  .route("/hardDelete/:id?")
  .delete(IDvalidation, productController.hardDeleteProductById);
//******************************** CRUD *****************************************
router
  .route("/:id?")
  .delete(IDvalidation, productController.deleteProductById)
  .patch(
    IDvalidation,
    upload.single("productimg"),
    productController.updateProductById
  );

module.exports = router;