const express=require('express');
const { getAllProducts,createProduct,updateProduct,deleteProduct, getProductDetails, createProductReview, getAllProductReviews, deleteProductReviews } = require('../controllers/productControllers');
const { isAuthenticated, authorisedRoles } = require('../middleware/auth');
const router= express.Router();



router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticated,authorisedRoles("admin"),createProduct);
router.route("/admin/product/:id")
.put(isAuthenticated,authorisedRoles("admin"),updateProduct)
.delete(isAuthenticated,authorisedRoles("admin"),deleteProduct)

router.route('/product/:id').get(getProductDetails);

router.route('/review').put(isAuthenticated,createProductReview)
router.route('/review').get(getAllProductReviews).delete(isAuthenticated,deleteProductReviews)
module.exports = router