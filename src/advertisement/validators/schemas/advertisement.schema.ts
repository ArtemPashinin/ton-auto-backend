import * as Joi from 'joi';

export const advertisementSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  model_id: Joi.number().required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  hp: Joi.number().integer().min(0).required(),
  mileage: Joi.number().integer().min(0).required(),
  engine_id: Joi.number().required(),
  color_id: Joi.number().required(),
  price: Joi.number().integer().min(0).required(),
  description: Joi.string().required(),
  condition_id: Joi.number().integer().required(),
  meta: Joi.string().optional(),
  commercial: Joi.boolean().required(),
});
