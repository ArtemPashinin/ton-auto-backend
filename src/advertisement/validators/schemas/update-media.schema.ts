import * as Joi from 'joi';

export const updateMainMedia = Joi.object({
  oldMainMediaId: Joi.number().required(),
  newMainMediaId: Joi.number().required(),
});
