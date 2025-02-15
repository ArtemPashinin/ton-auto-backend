// src/utils/file.ts

/**
 * Возвращает расширение файла в нижнем регистре
 * @param {string} url - URL или имя файла
 * @returns {string} - Расширение файла
 */
export const getFileExtension = (url: string): string => {
    return url.split('.').pop()?.toLowerCase() || '';
  };
  