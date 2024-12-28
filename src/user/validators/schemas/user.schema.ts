import * as Joi from 'joi';

export const userSchema = Joi.object({
  user_id: Joi.number().required(),
  username: Joi.string().optional(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  phone: Joi.string().optional(),
  language_code: Joi.string().optional(),
  city_id: Joi.number().required(),
});
