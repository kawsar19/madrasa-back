const Joi = require("joi");

const createStudentSchema = Joi.object({
  fullName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  studentClass: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(), // Valid ObjectId string
  studentImage: Joi.string().empty(null).optional(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
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
    phoneNumber: Joi.string().allow(""),
  }),
  madrasa: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // Assuming it's a valid ObjectId string
});
const attendanceSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(), // Assuming it's a valid ObjectId string
  madrasaId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(), // Assuming it's a valid ObjectId string
  classId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(), // Assuming it's a valid ObjectId string
  date: Joi.date().required(),
  status: Joi.string().valid("present", "absent", "leave","closed").required(),
});


const  paymentSchema = Joi.object({
  month: Joi.string().required(), // Month of the payment
  year: Joi.number().required(), // Year of the payment
  amount: Joi.number().min(0).required(), // Amount of the payment
  paid: Joi.boolean().required(), // Boolean indicating if payment is made or not
  discount: Joi.number().min(0).optional(), // Optional discount amount
  paymentMethod: Joi.string().required(), // Payment method
  receivedBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // Valid ObjectId string for the teacher who received the payment
  paymentDate: Joi.date().required(), // Date of the payment
  transactionID: Joi.string().optional(), // Optional transaction ID
  remarks: Joi.string().optional(), // Optional remarks
});


module.exports = {
  paymentSchema,
  paymentSchema
};

module.exports = {
  createStudentSchema,
  attendanceSchema,
};
