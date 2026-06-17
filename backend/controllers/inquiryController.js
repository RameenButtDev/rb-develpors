const Inquiry = require('../models/Inquiry');

exports.createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, property } = req.body;

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      property: property || null
    });

    res.status(201).json({
      status: 'success',
      data: { inquiry }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('property', 'title location price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: inquiries.length,
      data: { inquiries }
    });
  } catch (err) {
    next(err);
  }
};

exports.getInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('property', 'title location price');
    if (!inquiry) {
      res.status(404);
      return next(new Error('Inquiry not found'));
    }
    res.status(200).json({ status: 'success', data: { inquiry } });
  } catch (err) {
    next(err);
  }
};

exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!inquiry) {
      res.status(404);
      return next(new Error('Inquiry not found'));
    }
    res.status(200).json({ status: 'success', data: { inquiry } });
  } catch (err) {
    next(err);
  }
};

exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      res.status(404);
      return next(new Error('Inquiry not found'));
    }
    res.status(200).json({ status: 'success', message: 'Inquiry deleted successfully' });
  } catch (err) {
    next(err);
  }
};