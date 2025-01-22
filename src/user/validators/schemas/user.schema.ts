import * as Joi from 'joi';

export const userSchema = Joi.object({
  user_id: Joi.number().required(),
  username: Joi.string().optional().allow(''),
  first_name: Joi.string().optional().allow(''),
  last_name: Joi.string().optional().empty().allow(''),
  phone: Joi.string().optional(),
  language_code: Joi.string().optional(),
  city_id: Joi.number().required(),
});
