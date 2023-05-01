const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const sendToken = require("../utils/JwtToken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});

//login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if user has given email and password both
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 401));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //get resetPasswordToken
  const resetToken = user.passwordResetToken();

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  const message = `Your password reset token is:-\n\n ${resetPasswordUrl} \n\n if you have not requested this email then please 
  ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `email sent ot ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
// reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm Password doesn't match", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
});

//get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//update Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid current Password", 201));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("New Password doesn't match", 201));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//update User Profile
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

//getAllUser --admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
//get Single User --admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user not found with id:${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});
//update user role
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

//delete User --admin

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user not found with id:${req.params.id}`, 404)
    );
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
