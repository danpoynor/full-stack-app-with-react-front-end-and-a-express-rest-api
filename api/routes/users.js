'use strict';
const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Course, User } = require('../models');

// Return all properties and values for the currently authenticated user
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        id: req.currentUser.id
      },
      attributes: {
        exclude: ['password', 'confirmedPassword', 'createdAt', 'updatedAt']
      }
    });
    if (user) {
      // Get list of course titles for the current user
      const courses = await Course.findAll({
        where: {
          userId: req.currentUser.id
        },
        attributes: ['title']
      });
      // Add course titles to the user object
      user = { ...user.dataValues, courses: courses };
      res.status(200).json(user);
    } else {
      res.status(404).json({ "message": "User not found" });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Create a new user
router.post('/', asyncHandler(async (req, res) => {
  try {
    // Automatically create the user in db, so they can sign in right away
    await User.create(req.body);
    res.setHeader('Location', '/signin');
    res.status(201).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

module.exports = router;
