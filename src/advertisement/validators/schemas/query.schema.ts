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
  yearFrom: Joi.number().optional(),
  yearTo: Joi.number().optional(),
  mileageFrom: Joi.number().optional(),
  mileageTo: Joi.number().optional(),
  userId: Joi.number().optional(),
  favorites: Joi.boolean().optional().default(false),
  owned: Joi.boolean().default(false),
  commercial: Joi.boolean().optional(),
});
