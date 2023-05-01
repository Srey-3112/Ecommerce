const express=require('express');
const { isAuthenticated, authorisedRoles } = require('../middleware/auth');
const { createOrder, getSingleOrder, myOrder, updateOrder, deleteOrder, getAllOrders } = require('../controllers/orderController');
const router= express.Router();

router.route('/order/new').post(isAuthenticated,createOrder)
router.route('/order/:id').get(isAuthenticated,getSingleOrder)
router.route('/order').get(isAuthenticated,myOrder)

router
  .route("/admin/orders")
  .get(isAuthenticated, authorisedRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorisedRoles("admin"), updateOrder)
  .delete(isAuthenticated, authorisedRoles("admin"), deleteOrder);
module.exports = router