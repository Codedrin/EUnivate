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

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePictureData = profilePicture ? {
      url: profilePicture,
      publicId: 'default'
    } : {
      url: 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png',
      publicId: 'default'
    };

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

    const twoFactorToken = generateNumericOtp(4);
    user.twoFactorToken = twoFactorToken;
    user.twoFactorTokenExpire = Date.now() + 10 * 60 * 1000; 

    const createdUser = await user.save();

    const message = `Your OTP code is ${twoFactorToken}`;
    await sendEmail({
      email: createdUser.email,
      subject: 'Account Verification OTP',
      message,
    });

    const accessToken = generateAccessToken(createdUser._id);
    const refreshToken = generateRefreshToken(createdUser._id);

    createdUser.refreshToken.push(refreshToken);
    await createdUser.save();

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