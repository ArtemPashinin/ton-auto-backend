import * as Joi from 'joi';

export const favoriteSchema = Joi.object({
  userId: Joi.number().required(),
  advertisementId: Joi.string().max(36).required(),
});
