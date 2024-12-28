import * as Joi from 'joi';

export const querySchema = Joi.object({
  page: Joi.number().default(1),
  make: Joi.number().optional(),
  model: Joi.number().optional(),
  engine: Joi.number().optional(),
  color: Joi.number().optional(),
  condition: Joi.number().optional(),
  country: Joi.number().optional(),
  city: Joi.number().optional(),
});
