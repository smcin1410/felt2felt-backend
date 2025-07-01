const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const User = require('../models/User');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- REGISTER A NEW USER ---
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();
    const verificationUrl = `http://localhost:5000/api/users/verify/${verificationToken}`;
    const msg = {
      to: user.email,
      from: process.env.FROM_EMAIL,
      subject: 'Welcome to Felt2Felt! Please Verify Your Email',
      html: `<h1>Welcome to Felt2Felt!</h1><p>Thank you for registering. Please click the link below to verify your email address:</p><a href="${verificationUrl}" target="_blank">Verify Email</a><p>If you did not create an account, please ignore this email.</p>`,
    };
    await sgMail.send(msg);
    res.status(201).send('Registration successful. Please check your email to verify your account.');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- VERIFY USER'S EMAIL ---
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        if (!user) {
            return res.status(400).send('Invalid verification token.');
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        res.send('<h1>Email successfully verified!</h1><p>You can now log in to your account.</p>');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- LOGIN A USER ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Incorrect Username and/or Password' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email before logging in.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect Username and/or Password' });
    }

    // UPDATED: Include the user's role in the JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role // Add the role here
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
