/**
 * تحويل الوقت المحلي إلى UTC
 * @param dateString - التاريخ بصيغة YYYY-MM-DD
 * @param timeString - الوقت بصيغة HH:MM (بتوقيت القاهرة)
 * @returns الوقت بصيغة ISO string (UTC)
 */
export function convertLocalToUTC(dateString: string, timeString: string): string {
  // إنشاء تاريخ بتوقيت القاهرة (UTC+2)
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);

  // إنشاء date object بالتوقيت المحلي
  const localDate = new Date(year, month - 1, day, hours, minutes, 0);

  // تحويل إلى UTC بطرح 2 ساعة (فارق توقيت مصر)
  const utcDate = new Date(localDate.getTime() - 2 * 60 * 60 * 1000);

  return utcDate.toISOString();
}

/**
 * تحويل UTC إلى الوقت المحلي (القاهرة)
 * @param utcString - الوقت بصيغة ISO string (UTC)
 * @returns الوقت المحلي بصيغة readable
 */
export function formatLocalTime(utcString: string): string {
  const date = new Date(utcString);
  
  // إضافة 2 ساعة لتحويل إلى توقيت مصر
  date.setHours(date.getHours() + 2);

  return date.toLocaleString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Cairo'
  });
}

/**
 * الحصول على الوقت الحالي بتنسيق YYYY-MM-DD
 */
export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * تحويل ISO string إلى تنسيق التاريخ المحلي
 */
export function getLocalDateString(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
