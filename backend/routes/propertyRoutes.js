const express = require('express');
const { body } = require('express-validator');
const propertyController = require('../controllers/propertyController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public — anyone can view properties
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getProperty);

// Admin only — create, update, delete properties
router.post(
  '/',
  protect,
  authorizeRoles('Admin', 'Agent'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('description').optional().trim(),
  ],
  propertyController.createProperty
);

router.patch(
  '/:id',
  protect,
  authorizeRoles('Admin', 'Agent'),
  propertyController.updateProperty
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('Admin'),
  propertyController.deleteProperty
);

module.exports = router;
