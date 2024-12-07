import * as Joi from 'joi';
import { findUserSchema } from './find-user.schema';

export const favoriteSchema = Joi.object({
  userId: findUserSchema,
  advertisementId: Joi.string().max(36).required(),
});
