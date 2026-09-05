import { AppLanguage } from '../../types';

export const getMonthsList = (lang: AppLanguage = AppLanguage.EN) => {
  return Array.from({ length: 12 }, (_, i) => {
    let monthName = new Intl.DateTimeFormat(lang, { month: 'long' }).format(new Date(0, i));

    if (lang !== AppLanguage.EN) {
      monthName = monthName[0].toUpperCase() + monthName.slice(1);
    }

    return monthName;
  });
};
