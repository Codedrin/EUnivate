import User from '../../models/Client/userModels.js';
import bcrypt from 'bcrypt';

import sendEmail from '../../utils/sendEmail.js'; 
import { generateRefreshToken, generateAccessToken } from '../../utils/jwtUtils.js';


const generateNumericOtp = (length) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // Generates a random number between 0 and 9
  }
  return otp;
};





// Create a new user

export const createUser = async (req, res) => {
  const { firstName, lastName, username, email, phoneNumber, password, role, profilePicture } = req.body;

  console.log('Request received to create user:', { firstName, lastName, username, email });

  try {
    console.log('Checking if email already exists...');
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    console.log('Checking if username already exists...');
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      console.log('Username already exists:', username);
      return res.status(400).json({ message: 'Username already exists' });
    }

    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Preparing profile picture data...');
    const profilePictureData = profilePicture ? {
      url: profilePicture,
      publicId: 'default'
    } : {
      url: 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png',
      publicId: 'default'
    };

    console.log('Creating new user object...');
    const user = new User({
      firstName,
      lastName,
      username,
      phoneNumber,
      email,
      password: hashedPassword,
      profilePicture: profilePictureData,
      role: role || 'User',
    });

    console.log('Generating two-factor authentication token...');
    const twoFactorToken = generateNumericOtp(4);
    user.twoFactorToken = twoFactorToken;
    user.twoFactorTokenExpire = Date.now() + 10 * 60 * 1000;

    console.log('Saving new user to database...');
    const createdUser = await user.save();
    console.log('User created successfully:', createdUser._id);

    console.log('Sending verification email...');
    const message = `Your OTP code is ${twoFactorToken}`;
    await sendEmail({
      email: createdUser.email,
      subject: 'Account Verification OTP',
      message,
    });

    console.log('Generating access and refresh tokens...');
    const accessToken = generateAccessToken(createdUser._id);
    const refreshToken = generateRefreshToken(createdUser._id);

    console.log('Storing refresh token in database...');
    createdUser.refreshToken.push(refreshToken);
    await createdUser.save();

    console.log('Responding to client with user data and tokens...');
    res.status(201).json({
      _id: createdUser._id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      username: createdUser.username,
      email: createdUser.email,
      phoneNumber: createdUser.phoneNumber,
      profilePicture: createdUser.profilePicture,
      role: createdUser.role,
      twoFactorToken: createdUser.twoFactorToken,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};






// Get the current user's data
export const getCurrentUser = async (req, res) => {
  try {
    // Use req.user to find the currently authenticated user (set in the authenticate middleware)
    const user = await User.findById(req.user.id).select('-password'); // Exclude the password field from the response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      role: user.role,
    });
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
