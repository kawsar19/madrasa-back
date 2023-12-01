const Joi = require('joi');

const createStudentSchema = Joi.object({
  fullName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  studentClass: Joi.string().required(),
  studentImage: Joi.string().allow('').optional(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  phone: Joi.string().required(),
  address: Joi.object({
    village: Joi.string(),
    upazila: Joi.string(),
    district: Joi.string(),
    division: Joi.string(),
    union: Joi.string(),
  }),
  guardian: Joi.object({
    fullName: Joi.string(),
    phoneNumber: Joi.string(),
  }),
  madrasa: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // Assuming it's a valid ObjectId string
});

module.exports = {
  createStudentSchema
};
