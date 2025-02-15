import { VIDEO_EXTENSIONS } from 'src/common/constants/extensions';
import { getFileExtension } from './get-file-extension';
import { FileModel } from 'src/advertisement/models/image.model';
import {
  InputFile,
  InputMediaPhoto,
  InputMediaVideo,
  ParseMode,
} from 'grammy/types';
import { InputMediaBuilder } from 'grammy';

/**
 * Генерирует массив InputMedia объектов для отправки в Telegram.
 * Включает видео или фото в зависимости от расширения файла.
 *
 * @param {FileModel[]} files - Массив файлов.
 * @param {string} caption - Описание для первого элемента.
 * @returns {(InputMediaPhoto | InputMediaVideo)[]} - Массив медиа для отправки.
 */
export const mediaBuilder = (
  files: FileModel[],
  caption: string,
): (InputMediaPhoto | InputMediaVideo)[] =>
  files.map(({ image_url }, index) => {
    const extension = getFileExtension(image_url);

    const commonOptions: { caption: string; parse_mode: ParseMode } = {
      caption: index === 0 ? caption : '',
      parse_mode: 'HTML',
    };
    if (VIDEO_EXTENSIONS.includes(extension)) {
      return InputMediaBuilder.video(image_url, commonOptions);
    }

    return InputMediaBuilder.photo(image_url, commonOptions);
  });
