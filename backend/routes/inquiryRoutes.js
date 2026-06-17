const express = require('express');
const { body } = require('express-validator');
const inquiryController = require('../controllers/inquiryController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public — anyone can submit an inquiry
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('phone').optional().trim(),
    body('property').optional().isMongoId().withMessage('Invalid property ID')
  ],
  inquiryController.createInquiry
);

router.get('/', protect, authorizeRoles('Admin'), inquiryController.getAllInquiries);
router.get('/:id', protect, authorizeRoles('Admin'), inquiryController.getInquiry);
router.patch('/:id', protect, authorizeRoles('Admin'), inquiryController.updateInquiryStatus);
router.delete('/:id', protect, authorizeRoles('Admin'), inquiryController.deleteInquiry);
module.exports = router;