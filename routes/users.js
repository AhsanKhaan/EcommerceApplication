const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/users');
const {createUserValidation,userLoginValidation}= require('../validations/users');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User Signup and Login
 *   - name: Vendors
 *     description: Vendor Signup and Login
 */
/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: User SignUp
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: username should be unique
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (at least 6 characters)
 *     responses:
 *       200:
 *         description: Successful signup
 *         content:
 *           application/json:
 *             example:
 *               token: <JWT_TOKEN>
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ msg: 'Please enter valid username.' }, { msg: 'Please enter your email address.' }, { msg: 'Password must be strong (include uppercase, lowercase, number, and special character).' }]
 *       409:
 *         description: Conflict (user already exists)
 *         content:
 *           application/json:
 *             example:
 *               msg: 'User already exists'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: 'Server error'
 */

router.post(
  '/signup',
  createUserValidation,
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          msg: 'User already exists',
        });
      }

      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWTSECRET,
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          return res.json({
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);
/**
 *  @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Vendor login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (at least 6 characters)
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: <JWT_TOKEN>
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ msg: 'Please enter your email address.' }, { msg: 'Please insert at least 6 characters.' }]
 *       409:
 *         description:  Bad request ( user not exists)
 *         content:
 *           application/json:
 *             example:
 *               msg: 'User Not exists'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: 'Server error'
 */
 router.post(
  '/login',
userLoginValidation,
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ result: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(409).json({
          msg: 'Vendor not exists.',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          msg: 'Invalid password',
        });
      }

      const payload = {
        user: {
          id: user.id,
          role:user.role,
          username:user.username,
          email:user.email
        },
      };

      jwt.sign(
        payload,
        process.env.JWTSECRET,
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;
          return res.json({
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({
        msg: 'Server Error',
      });
    }
  }
);
/**
 * @swagger
 * /api/v1/users/vendor-signup:
 *   post:
 *     summary: Vendor SignUp
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: username should be unique
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (at least 6 characters)
 *     responses:
 *       200:
 *         description: Successful signup
 *         content:
 *           application/json:
 *             example:
 *               token: <JWT_TOKEN>
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ msg: 'Please enter valid username.' }, { msg: 'Please enter your email address.' }, { msg: 'Password must be strong (include uppercase, lowercase, number, and special character).' }]
 *       409:
 *         description: Conflict (user already exists)
 *         content:
 *           application/json:
 *             example:
 *               msg: 'User already exists'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: 'Server error'
 */

router.post(
  '/vendor-signup',
  createUserValidation,
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          msg: 'Vendor already exists',
        });
      }

      user = new User({
        username,
        email,
        password,
        role: 'vendor',
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWTSECRET,
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          return res.json({
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);
/**
 *  @swagger
 * /api/v1/users/vendor-login:
 *   post:
 *     summary: Vendor login
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (at least 6 characters)
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: <JWT_TOKEN>
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ msg: 'Please enter your email address.' }, { msg: 'Please insert at least 6 characters.' }]
 *       409:
 *         description:  Bad request ( user not exists)
 *         content:
 *           application/json:
 *             example:
 *               msg: 'User Not exists'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: 'Server error'
 */
 router.post(
  '/vendor-login',
userLoginValidation,
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ result: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(409).json({
          msg: 'Vendor not exists.',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          msg: 'Invalid password',
        });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role,
          username: user.username,
          email: user.email
        },
      };

      jwt.sign(
        payload,
        process.env.JWTSECRET,
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;
          return res.json({
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({
        msg: 'Server Error',
      });
    }
  }
);
module.exports = router;
