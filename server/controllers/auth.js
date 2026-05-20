import mongoose from 'mongoose';
import User from '../models/Auth.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmailOTP(email, otp) {
  await transporter.sendMail({
    from: `"YouTube Clone" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Login OTP',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#111827">Your OTP Code</h2>
        <p style="color:#6b7280">Use the code below to complete your login. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#111827;margin:24px 0">${otp}</div>
        <p style="color:#9ca3af;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}


export const login = async (req, res) => {
    const { email, name, image } = req.body;
    try {
        const existinguser = await User.findOne({ email });
        if (!existinguser) {
            try {
                const newUser = await User.create({ email, name, image })
                res.status(200).json({ result: newUser });
            } catch (error) {
                res.status(500).json({ message: "Error creating user", error });
                return;
            }
        } else {
            res.status(200).json({ result: existinguser });
        }
    } catch (error) {
        res.status(500).json({ message: "Error finding user", error });
        return;
    }
}

export const updateprofile = async (req, res) => {
    const { id: id } = req.params;
    const { channelname, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(500).json({ message: "User Unavailable" });
    }
    try {
        const updatedata = await User.findByIdAndUpdate(
            id, {
            $set: {
                channelname: channelname,
                description: description
            },
        },
            { new: true }
        )
        res.status(200).json({ result: updatedata });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
}

export const sendOTP = async (req, res) => {
  try {
    const { email, isSouthIndia } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign in with Google first.' });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await User.findByIdAndUpdate(user._id, { otp, otpExpiresAt });

    if (isSouthIndia) {
    
      await sendEmailOTP(user.email, otp);
      return res.status(200).json({
        message: `OTP sent to your registered email (${user.email})`,
        channel: 'email',
      });
    } else {
      const phone = user.phone || 'N/A';
      console.log(`[SMS OTP] To: ${phone} | OTP: ${otp}`);
      return res.status(200).json({
        message: `OTP sent to your registered mobile number`,
        channel: 'mobile',
      
        ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
      });
    }
  } catch (error) {
    console.error('sendOTP error:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'No OTP requested. Please request a new one.' });
    }

    if (new Date() > user.otpExpiresAt) {
      await User.findByIdAndUpdate(user._id, { otp: null, otpExpiresAt: null });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { otp: null, otpExpiresAt: null },
      { new: true }
    );

    const userData = updatedUser.toObject();
    userData.id = userData._id;
    delete userData._id;

    return res.status(200).json({ message: 'OTP verified successfully', result: userData });
  } catch (error) {
    console.error('verifyOTP error:', error);
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
};