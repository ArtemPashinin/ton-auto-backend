import { InputFile, InputMediaBuilder } from 'grammy';
import { InputMediaPhoto } from 'grammy/types';
import { FileModel } from 'src/advertisement/models/image.model';

export const mediaBuilder = (
  files: FileModel[],
  caption: string,
): InputMediaPhoto[] => {
  return files.map(({ image_url }, index) =>
    InputMediaBuilder.photo(new InputFile(new URL(image_url)), {
      caption: index === 0 ? caption : '',
      parse_mode: 'HTML',
    }),
  );
};
