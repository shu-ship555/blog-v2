// src/utils/date.ts

/**
 * ISO 8601形式の日付文字列を「YYYY年MM月DD日」形式に変換します。
 * @param dateString - 変換対象の日付文字列（例: "2025-08-04T23:30:41.810Z"）
 * @returns フォーマットされた日付文字列（例: "2025年08月04日"）
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}年${month}月${day}日`;
};
