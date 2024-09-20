// import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";
// import nodemailer from "nodemailer";
// import axios from "axios";

// export const register = async (req, res) => {
//   try {
//     const { fullname, email, phoneNumber, password, role } = req.body;
//     if (!fullname || !email || !phoneNumber || !password || !role) {
//       return res
//         .status(400)
//         .json({ message: "All fields are required", success: false });
//     }
//     const file = req.files?.file?.[0];
//     let cloudResponse;
//     if (file) {
//       const fileUri = getDataUri(file);
//       cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//     }

//     const checkUser = await User.findOne({ email });
//     if (checkUser)
//       return res.status(400).json({
//         message: "User already exist with this email",
//         success: false,
//       });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     let newUser = await User.create({
//       fullname,
//       email: email?.toLowerCase(),
//       phoneNumber,
//       password: hashedPassword,
//       role,
//       profile: {
//         profilePhoto: cloudResponse?.secure_url,
//       },
//     });

//     await axios.post(
//       `http://localhost:8000/api/v1/notification/post-notification`,
//       {
//         userId: newUser?._id,
//         fullname: newUser?.fullname,
//         type: "welcome",
//       }
//     );

//     await axios.post(
//       `http://localhost:8000/api/v1/notification/post-notification`,
//       {
//         userId: newUser?._id,
//         type: "setup",
//       }
//     );

//     let tokenData = {
//       userId: newUser?._id,
//     };
//     let token = await jwt.sign(tokenData, process.env.SECRET_KEY);

//     let user = {
//       _id: newUser._id,
//       fullname: newUser.fullname,
//       email: newUser.email,
//       phoneNumber: newUser.phoneNumber,
//       role: newUser.role,
//       isFcmPosted: newUser.isFcmPosted,
//       profile: newUser.profile,
//     };

//     return res
//       .status(200)
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "None",
//       })
//       .json({
//         message: `Welcome to HireO ${newUser.fullname}`,
//         user,
//         success: true,
//       });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;
//     if (!email || !password || !role)
//       return res
//         .status(400)
//         .json({ message: "All fields are required", success: false });
//     let user = await User.findOne({ email });
//     if (!user)
//       return res.status(401).json({ message: "Incorrect email or password" });
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch)
//       return res.status(401).json({ message: "Incorrect email or password" });

//     if (role !== user.role) {
//       return res
//         .status(400)
//         .json({ message: "Account doesn't exist with current role" });
//     }
//     const tokenData = {
//       userId: user._id,
//     };
//     // const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
//     //   expiresIn: "1d",
//     // });
//     const token = await jwt.sign(tokenData, process.env.SECRET_KEY);

//     user = {
//       _id: user._id,
//       fullname: user.fullname,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       isFcmPosted: user.isFcmPosted,
//       profile: user.profile,
//     };
//     return res
//       .status(200)
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: true, // Ensure your site is served over HTTPS
//         sameSite: "None", // Use 'None' since frontend and backend are on different domains
//       })
//       .json({
//         message: `Welcome Back ${user.fullname}`,
//         user,
//         success: true,
//       });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

// export const logout = async (req, res) => {
//   try {
//     return res.status(200).cookie("token", "", { maxAge: 0 }).json({
//       message: "Logged out successfully",
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

// export const updateProfile = async (req, res) => {
//   try {
//     const { fullname, email, phoneNumber, bio, skills } = req.body;

//     const file = req.files?.file?.[0];
//     const profilePhoto = req.files?.profilePhoto?.[0];

//     let cloudResponse = null;
//     let profilePhotoResponse = null;

//     if (file) {
//       const fileUri = getDataUri(file);
//       cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//     }

//     if (profilePhoto) {
//       const profilePhotoUri = getDataUri(profilePhoto);
//       profilePhotoResponse = await cloudinary.uploader.upload(
//         profilePhotoUri.content
//       );
//     }

//     if (!fullname || !email || !phoneNumber) {
//       console.log({ message: "Please fill all the fields.", success: false });
//       return res
//         .status(400)
//         .json({ message: "Please fill all the fields.", success: false });
//     }

//     if (!skills) {
//       return res.status(400).json({
//         message:
//           "Oops! It looks like you haven't added any skills yet. Please share your skills to enhance your profile.",
//         success: false,
//       });
//     }
//     let skillsArray;
//     if (skills) {
//       skillsArray = skills.split(",");
//     }
//     const userId = req.id;

//     let user = await User.findById(userId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found", success: false });
//     }

//     if (fullname) user.fullname = fullname;
//     if (email) user.email = email?.toLowerCase();
//     if (phoneNumber) user.phoneNumber = phoneNumber;
//     user.profile.bio = bio || "";
//     if (skills) user.profile.skills = skillsArray;

//     if (cloudResponse) {
//       user.profile.resume = cloudResponse.secure_url;
//       user.profile.resumeOriginalName = file.originalname;
//     }

//     if (profilePhotoResponse) {
//       user.profile.profilePhoto = profilePhotoResponse.secure_url;
//     }
//     if (!profilePhoto && !req?.body?.profilePhoto) {
//       user.profile.profilePhoto = "";
//     }

//     await user.save();

//     user = {
//       _id: user._id,
//       fullname: user.fullname,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       profile: user.profile,
//     };

//     return res.status(200).json({
//       message: "Profile updated successfully.",
//       user,
//       success: true,
//     });
//   } catch (error) {
//     console.log("ERROR MANNI:", error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

// export const sendEmail = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(404).json({
//       message: "No user found with this email.",
//       success: false,
//     });
//   }

//   const secret = process.env.SECRET_KEY + user.password;
//   const payload = { email: user.email, id: user._id };
//   const token = jwt.sign(payload, secret, { expiresIn: "15m" });
//   const BaseURL = process.env.BASE_URL;
//   const link = `${BaseURL}/api/v1/user//resetpassword/${user.id}/${token}`;
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: email,
//       subject: "Reset Password Link",
//       html: `<!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Password Reset</title>
//       </head>
//       <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; width:"100%">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
//           <h2 style="color: #333;">Password Reset</h2>
//           <p style="color: #555;">Hello, ${user?.fullname}</p>
//           <p style="color: #555;">We received a request to reset your password. Click the button below to reset it:</p>
//           <p style="color: #555;"><strong>Note:</strong>The link is valid only for 15 minutes.</p>
//           <a style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease;" href=${link}>Reset Password</a>
//           <p style="color: #555;">If you didn't request a password reset, you can ignore this email.</p>
//           <p style="color: #555;">Thank you!</p>
//         </div>
//       </body>
//       </html>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     return res.status(201).json({
//       message:
//         "We've sent a reset link to your email. Check your inbox or spam folder.",
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

// export const resetPassword = async (req, res) => {
//   const { id, token } = req.params;
//   const user = await User.findOne({ _id: id });
//   if (!user) {
//     return res.send("Invalid user");
//   }
//   const secret = process.env.SECRET_KEY + user.password;

//   try {
//     const payload = jwt.verify(token, secret);
//     res.render("forgot-password", {
//       email: payload.email,
//       id: id,
//       token: token,
//       status: "not verified",
//     });
//   } catch (error) {
//     res.send("This Link has expired. Please request for a new one");
//   }
// };

// export const submitNewPassword = async (req, res) => {
//   const { id, token } = req.params;
//   const { password } = req.body;

//   const oldUser = await User.findOne({ _id: id });
//   if (!oldUser) {
//     return res.status(404).json({ status: "User does not exist" });
//   }
//   const secret = process.env.SECRET_KEY + oldUser.password;

//   try {
//     const payload = jwt.verify(token, secret);
//     const encryptPassword = await bcrypt.hash(password, 10);

//     await User.updateOne({ _id: id }, { $set: { password: encryptPassword } });

//     res.render("confirmation");
//   } catch (error) {
//     res.status(500).json({ status: "Something went wrong." });
//   }
// };

///////////////////// COOKIE ERROR BUG FIX /////////////////////////////////////////////////////////////////

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import nodemailer from "nodemailer";
import axios from "axios";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    // if (!fullname || !email || !phoneNumber || !password || !role) {
    if (!fullname || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const file = req.files?.file?.[0];
    let cloudResponse;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.status(400).json({
        message: "User already exist with this email",
        success: false,
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await User.create({
      fullname,
      email: email?.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse?.secure_url,
      },
    });

    await axios.post(
      `http://localhost:8000/api/v1/notification/post-notification`,
      {
        userId: newUser?._id,
        fullname: newUser?.fullname,
        type: "welcome",
      }
    );

    await axios.post(
      `http://localhost:8000/api/v1/notification/post-notification`,
      {
        userId: newUser?._id,
        type: "setup",
      }
    );

    let tokenData = {
      userId: newUser?._id,
    };
    let token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    let user = {
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      isFcmPosted: newUser.isFcmPosted,
      profile: newUser.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: false,
        secure: true,
        sameSite: "None",
        // maxAge: 60 * 60 * 1000, // 60m = 1h
        // maxAge: 540 * 60 * 1000, // 540 mins = 9 hrs
        maxAge: 1440 * 60 * 1000, // 24 hours
      })

      .json({
        message: `Welcome to HireO ${newUser.fullname}`,
        user,
        token,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    let user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Incorrect email or password" });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(401).json({ message: "Incorrect email or password" });

    if (role !== user.role) {
      return res
        .status(400)
        .json({ message: "Account doesn't exist with current role" });
    }
    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isFcmPosted: user.isFcmPosted,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: false, //make this true while pushing code to production
        secure: true,
        sameSite: "None",
        // maxAge: 60 * 60 * 1000, // 60m = 1h
        // maxAge: 540 * 60 * 1000, // 540 mins = 9 hrs
        maxAge: 1440 * 60 * 1000, // 24 hours
      })
      .json({
        message: `Welcome Back ${user.fullname}  `,
        user,
        token,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.files?.file?.[0];
    const profilePhoto = req.files?.profilePhoto?.[0];

    let cloudResponse = null;
    let profilePhotoResponse = null;

    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    if (profilePhoto) {
      const profilePhotoUri = getDataUri(profilePhoto);
      profilePhotoResponse = await cloudinary.uploader.upload(
        profilePhotoUri.content
      );
    }

    if (!fullname || !email || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields.", success: false });
    }

    if (!skills) {
      return res.status(400).json({
        message:
          "Oops! It looks like you haven't added any skills yet. Please share your skills to enhance your profile.",
        success: false,
      });
    }
    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id;

    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email?.toLowerCase();
    if (phoneNumber) user.phoneNumber = phoneNumber;
    user.profile.bio = bio || "";
    if (skills) user.profile.skills = skillsArray;

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    if (profilePhotoResponse) {
      user.profile.profilePhoto = profilePhotoResponse.secure_url;
    }
    if (!profilePhoto && !req?.body?.profilePhoto) {
      user.profile.profilePhoto = "";
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const sendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "No user found with this email.",
      success: false,
    });
  }

  const secret = process.env.SECRET_KEY + user.password;
  const payload = { email: user.email, id: user._id };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const BaseURL = process.env.BASE_URL;
  const link = `${BaseURL}/api/v1/user//resetpassword/${user.id}/${token}`;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Reset Password Link",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; width:"100%">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Password Reset</h2>
          <p style="color: #555;">Hello, ${user?.fullname}</p>
          <p style="color: #555;">We received a request to reset your password. Click the button below to reset it:</p>
          <p style="color: #555;"><strong>Note:</strong>The link is valid only for 15 minutes.</p>
          <a style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease;" href=${link}>Reset Password</a>
          <p style="color: #555;">If you didn't request a password reset, you can ignore this email.</p>
          <p style="color: #555;">Thank you!</p>
        </div>
      </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message:
        "We've sent a reset link to your email. Check your inbox or spam folder.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.send("Invalid user");
  }
  const secret = process.env.SECRET_KEY + user.password;

  try {
    const payload = jwt.verify(token, secret);
    res.render("forgot-password", {
      email: payload.email,
      id: id,
      token: token,
      status: "not verified",
    });
  } catch (error) {
    res.send("This Link has expired. Please request for a new one");
  }
};

export const submitNewPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.status(404).json({ status: "User does not exist" });
  }
  const secret = process.env.SECRET_KEY + oldUser.password;

  try {
    const payload = jwt.verify(token, secret);
    const encryptPassword = await bcrypt.hash(password, 10);

    await User.updateOne({ _id: id }, { $set: { password: encryptPassword } });

    res.render("confirmation");
  } catch (error) {
    res.status(500).json({ status: "Something went wrong." });
  }
};

export const updateOnBoarded = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { hasOnboarded: true } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "User onboarded status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
