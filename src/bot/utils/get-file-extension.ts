/**
 * Возвращает расширение файла в нижнем регистре
 * @param {string} fileName - Имя файла или URL
 * @returns {string} - Расширение файла
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};
