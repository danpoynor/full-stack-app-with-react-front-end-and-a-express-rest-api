const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Retrieve all Courses including associated Users
router.get('/', asyncHandler(async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: User,
        attributes: ['firstName', 'lastName']
      }],
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })
    if (courses) {
      res.status(200).json(courses);
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

// Retrieve a single Course based on unique id including the associated User
router.get('/:id', asyncHandler(async (req, res) => {
  try {
    const course = await Course.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: User,
        attributes: ['firstName', 'lastName']
      }],
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ "message": "Course not found" });
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

// Create a new Course
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.setHeader('Location', `/courses/${course.id}`);
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

// Update an existing Course based on unique id
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      // User has been authenticated and course exists.
      // Ensure that the currently authenticated user is the
      // authorized owner of the requested course.
      if (req.body.userId !== course.userId) {
        res.status(403).json({ "message": "Access Denied. You are not the owner of this course." });
      } else {
        await course.update(req.body);
        res.setHeader('Location', `/courses/${course.id}`);
        res.status(204).end();
      }
    } else {
      res.status(404).json({ "message": "Course not found" });
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

// Delete an existing Course based on unique id
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      // Ensure that the currently authenticated user is the owner of the
      // requested course
      if (req.currentUser.id !== course.userId) {
        res.status(403).json({ "message": "Access Denied. You are not the owner of this course." });
      } else {
        await course.destroy();
        res.setHeader('Location', '/'); // redirect to home page
        res.status(204).end();
      }
    } else {
      res.status(404).json({ "message": "Course not found" });
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

module.exports = router;
