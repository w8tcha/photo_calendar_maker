import { AppLanguage } from '../../types';

/**
 * @property {Function} getWeekDays - generates array of week days
 * @param {string} length - length of week day name
 */
export default function getWeekDays(
  length: 'long' | 'short' | 'narrow' | undefined,
  lang: AppLanguage,
): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    let weekDay = new Intl.DateTimeFormat(lang, {
      weekday: length,
    }).format(new Date(0, 0, i + 1));

    // Capitalize first letters
    if (lang !== AppLanguage.EN) {
      weekDay = weekDay[0].toUpperCase() + weekDay.slice(1);
    }
    return weekDay;
  });
}
