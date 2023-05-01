const express=require('express');
const { registerUser, loginUser, logoutUser , forgotPassword, resetPassword, getUserDetails, updatePassword, updateUserProfile, getAllUsers, getSingleUser, deleteUser, updateUserRole} = require('../controllers/userController');
const { isAuthenticated, authorisedRoles } = require('../middleware/auth');
const router= express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/me').get(isAuthenticated,getUserDetails)
router.route('/password/update').put(isAuthenticated,updatePassword)
router.route('/me/update').put(isAuthenticated,updateUserProfile)
router.route('/logout').get(logoutUser);
router.route('/admin/users').get(isAuthenticated,authorisedRoles("admin"),getAllUsers)
router.route('/admin/user/:id').get(isAuthenticated,authorisedRoles("admin"),getSingleUser)
.put(isAuthenticated,authorisedRoles("admin"), updateUserRole)
.delete(isAuthenticated,authorisedRoles("admin"),deleteUser) 
module.exports = router;