const Property = require('../models/Property');

exports.createProperty = async (req, res, next) => {
  try {
    const { title, description, location, price, agent } = req.body;

    if (!title || !location) {
      res.status(400);
      return next(new Error('Title and location are required'));
    }

    const property = await Property.create({
      title,
      description,
      location,
      price,
      agent: agent || req.user?._id || null
    });

    res.status(201).json({
      status: 'success',
      data: { property }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .populate('agent', 'fullName email contactNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: properties.length,
      data: { properties }
    });
  } catch (err) {
    next(err);
  }
};

exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'fullName email contactNumber');
    if (!property) {
      res.status(404);
      return next(new Error('Property not found'));
    }
    res.status(200).json({ status: 'success', data: { property } });
  } catch (err) {
    next(err);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!property) {
      res.status(404);
      return next(new Error('Property not found'));
    }
    res.status(200).json({ status: 'success', data: { property } });
  } catch (err) {
    next(err);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      res.status(404);
      return next(new Error('Property not found'));
    }
    res.status(200).json({ status: 'success', message: 'Property deleted successfully' });
  } catch (err) {
    next(err);
  }
};
