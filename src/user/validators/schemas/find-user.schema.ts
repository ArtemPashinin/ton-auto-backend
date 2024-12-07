import * as Joi from 'joi';

export const findUserSchema = Joi.object({
  id: Joi.number().optional(),
  tgId: Joi.number().optional(),
}).or('id', 'tgId'); 