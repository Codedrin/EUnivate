import User from '../../models/Client/userModels.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwtUtils.js';
import sendEmail from '../../utils/sendEmail.js';

// Controller to verify OTP during two-factor authentication
export const verifyTwoFactorAuth = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user || user.twoFactorToken !== otp || user.twoFactorTokenExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Enable two-factor authentication after successful OTP verification
    user.twoFactorEnabled = true;
    user.twoFactorToken = undefined;
    user.twoFactorTokenExpire = undefined;
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Return the user data and tokens
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to verify OTP during login
export const verifyLoginOtp = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user || user.twoFactorToken !== otp || user.twoFactorTokenExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear the OTP data after successful verification
    user.twoFactorToken = undefined;
    user.twoFactorTokenExpire = undefined;
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add the refresh token to the user's refresh tokens array
    user.refreshToken = user.refreshToken || [];
    user.refreshToken.push(refreshToken);
    await user.save();

    // Return the user data and tokens
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error verifying login OTP:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to resend OTP
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a new OTP
    const twoFactorToken = Math.floor(1000 + Math.random() * 9000).toString();
    user.twoFactorToken = twoFactorToken;
    user.twoFactorTokenExpire = Date.now() + 60 * 1000; // OTP valid for 1 minute

    await user.save();

    // Send OTP email
    const message = `Your OTP code is ${twoFactorToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Resend OTP Code',
      message,
    });

    res.status(200).json({ message: 'OTP resent successfully!' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
