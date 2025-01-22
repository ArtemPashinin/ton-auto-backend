import * as Joi from 'joi';

export const MediaOrderDtoSchema = Joi.object({
  mediaId: Joi.number().integer().required(),
  order: Joi.number().integer().required(),
});

export const MediaOrderDtoArraySchema = Joi.array()
  .items(MediaOrderDtoSchema)
  .required();
