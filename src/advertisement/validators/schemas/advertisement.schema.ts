import * as Joi from 'joi';

export const advertisementSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  make: Joi.string().max(128).required(),
  model: Joi.string().max(128).required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  hp: Joi.number().integer().min(0).required(),
  mileage: Joi.number().integer().min(0).required(),
  engine: Joi.string().max(128).required(),
  color: Joi.string().max(128).required(),
  region: Joi.string().max(128).required(),
  price: Joi.number().integer().min(0).required(),
  description: Joi.string().required(),
  currency: Joi.string().required(),
});
